import type { CarLocation } from "@/domain/types";
import GoogleMapReact from "google-map-react";
import { MapPin } from "lucide-react";

export default function SimpleMap({
  carLocation,
}: {
  carLocation: CarLocation;
}) {
  const defaultProps = {
    center: {
      lat: carLocation.latitude,
      lng: carLocation.longitude,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    <div className="h-full w-full">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCQJ3PrlW50AKN8sFkbiIKPG9B46ai1bfA" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={carLocation.latitude}
          lng={carLocation.longitude}
        />
      </GoogleMapReact>
    </div>
  );
}

function AnyReactComponent() {
  return <MapPin className="text-rose-600" />;
}
