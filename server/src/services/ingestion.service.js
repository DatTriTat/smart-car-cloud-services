"use strict";

const fs = require("fs");
const path = require("path");
const {AudioMetadata, AudioEvent} = require("../models/mongo");
const AlertService = require("./alert.service");
const {BadRequestError} = require("../core/error.response");
const logger = require("../utils/logger");

class IngestionService {
    constructor() {
        this.mlServiceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8010/classify";
        this.uploadDir = path.join(process.cwd(), "uploads");

        // Ensure upload directory exists in dev
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, {recursive: true});
        }
    }

    /**
     * Process ingested audio
     * @param {Object} file - Multer file object
     * @param {Object} metadata - Parsed JSON metadata { carId, deviceId, timestamp, location, ... }
     */
    async processAudio(file, metadata) {
        if (!file) throw new BadRequestError("Audio file is required");
        if (!metadata || !metadata.carId || !metadata.deviceId) {
            throw new BadRequestError("Metadata with carId and deviceId is required");
        }

        logger.info(`Received audio file: ${file.originalname} for Car: ${metadata.carId}`);

        // 1. Store Audio (Strategy Pattern based on Env)
        const fileInfo = await this.storeAudioFile(file);

        // 2. Create MongoDB Records (Audit Trail)
        const audioMeta = await AudioMetadata.create({
            fileUrl: fileInfo.path, // Local path or S3 key
            fileSize: file.size,
            format: file.mimetype,
        });

        const audioEvent = await AudioEvent.create({
            carId: metadata.carId,
            deviceId: metadata.deviceId,
            eventType: "AUDIO_INGESTED",
            location: metadata.location, // e.g. "37.7749,-122.4194"
            audioMetadataId: audioMeta._id,
            timestamp: metadata.timestamp || new Date(),
            processed: false,
        });

        // 3. Call Classification Model
        let classifiedResults = [];
        try {
            classifiedResults = await this.callClassificationModel(file.path); // Use the temp path from multer

            logger.info(`ML Classification results for ${audioEvent.id}:`, classifiedResults);

            // Update event status
            audioEvent.processed = true;
            await audioEvent.save();

        } catch (error) {
            logger.error("ML Classification failed, proceeding without results:", error.message);
            // We still proceed to alert service? Or stop?
            // Usually, if ML fails, we might create a system alert or just log it.
            // Here we assume we pass empty results or handle error.
        }

        // 4. Pass to Alert Service
        // The AlertService.createAlert method will determine if an alert is needed based on thresholds
        if (classifiedResults && classifiedResults.length > 0) {
            const alert = await AlertService.createAlert({
                carId: metadata.carId,
                classifiedResults: classifiedResults,
                metadata: {
                    ...metadata,
                    ingestionId: audioEvent.id
                },
                audioEventId: audioEvent._id,
            });

            if (alert) {
                audioEvent.alertGenerated = true;
                await audioEvent.save();
            }
        }

        return {
            eventId: audioEvent.id,
            storagePath: fileInfo.path,
            classification: classifiedResults,
        };
    }

    async storeAudioFile(file) {
        const env = (process.env.NODE_ENV || "dev").toLowerCase();

        if (env === "production" || env === "prod") {
            // PROD: Placeholder for S3
            // In a real app, use @aws-sdk/client-s3 here
            const s3Key = `audio/${new Date().toISOString()}_${file.originalname}`;
            logger.info(`[PROD] Uploading ${file.originalname} to S3 bucket at ${s3Key}`);

            // Simulating S3 upload delay
            await new Promise(resolve => setTimeout(resolve, 100));

            return {path: `s3://my-bucket/${s3Key}`, location: "s3"};
        } else {
            // DEV: Store Locally
            // Multer 'diskStorage' might have already saved it to a temp folder.
            // We can move it to our permanent uploads folder or just use the temp path.
            // Assuming multer saved to 'file.path', we verify it.

            const targetPath = path.join(this.uploadDir, `${Date.now()}_${file.originalname}`);

            // If multer was memory storage, we write buffer. If disk, we rename/copy.
            // Assuming standard disk storage usage in routes:
            if (fs.existsSync(file.path)) {
                fs.copyFileSync(file.path, targetPath);
                // Optional: unlink old path if temp
                // fs.unlinkSync(file.path);
            } else if (file.buffer) {
                fs.writeFileSync(targetPath, file.buffer);
            }

            return {path: targetPath, location: "local"};
        }
    }

    async callClassificationModel(filePath) {
        // Read file from disk to send to ML service
        // Note: In Node 18+, fetch is global. FormData handles multipart.

        try {
            const fileData = fs.readFileSync(filePath);
            const blob = new Blob([fileData]);

            const formData = new FormData();
            formData.append("file", blob, path.basename(filePath));

            // Mocking the URL based on requirements
            // curl -X POST http://127.0.0.1:8010/classify -F "file=@sample.wav"

            const response = await fetch(this.mlServiceUrl, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`ML Service responded with ${response.status}: ${response.statusText}`);
            }

            // Assuming ML service returns JSON: [{ type: "engine_warning", confidence: 0.98 }]
            return await response.json();

        } catch (error) {
            // Fallback for dev/testing if ML service isn't running
            if (process.env.NODE_ENV === 'dev') {
                logger.warn("ML Service unreachable in DEV. Returning mock data.");
                return [
                    {type: "glass_break", confidence: 0.85},
                    {type: "engine_warning", confidence: 0.12}
                ];
            }
            throw error;
        }
    }
}

module.exports = new IngestionService();