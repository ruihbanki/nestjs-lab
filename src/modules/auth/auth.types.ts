export interface AuthPayload {
  clientId?: string;
  userId?: string;
}

export type AuthPayloadKey = keyof AuthPayload;
