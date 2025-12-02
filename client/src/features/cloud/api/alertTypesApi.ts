import type { AlertTypeDef } from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

function mapAlertType(dto: any): AlertTypeDef {
  return {
    id: dto?.type,
    key: dto?.type,
    type: dto?.type,
    name: dto?.name,
    description: dto?.description,
    category: dto?.category,
    defaultSeverity: dto?.defaultSeverity,
    enabled: dto?.enabled,
  };
}

export async function createAlertType(input: {
  type: string;
  description?: string;
  defaultSeverity?: AlertTypeDef["defaultSeverity"];
  category?: AlertTypeDef["category"];
  enabled?: boolean;
  name?: string;
}): Promise<AlertTypeDef> {
  const res = await authFetch("/alert-types", {
    method: "POST",
    body: JSON.stringify({
      type: input.type,
      name: input.name,
      description: input.description ?? input.name,
      defaultSeverity: input.defaultSeverity,
      category: input.category,
      enabled: input.enabled,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to create alert type");
  }

  return mapAlertType(body.data);
}

export async function updateAlertType(
  type: string,
  input: {
    newType?: string;
    description?: string;
    defaultSeverity?: AlertTypeDef["defaultSeverity"];
    category?: AlertTypeDef["category"];
    enabled?: boolean;
    name?: string;
  }
): Promise<AlertTypeDef> {
  const res = await authFetch(`/alert-types/${type}`, {
    method: "PUT", // single update verb; PATCH not used anymore
    body: JSON.stringify({
      newType: input.newType,
      name: input.name,
      description: input.description ?? input.name,
      defaultSeverity: input.defaultSeverity,
      category: input.category,
      enabled: input.enabled,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to update alert type");
  }

  return mapAlertType(body.data);
}

export async function deleteAlertType(type: string): Promise<string> {
  const res = await authFetch(`/alert-types/${type}`, { method: "DELETE" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to delete alert type");
  }
  return type;
}
