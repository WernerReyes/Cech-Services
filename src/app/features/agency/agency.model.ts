import { AuthState } from "@app/core/models/auth.model";

export interface CatalogValue {
  id: number;
  valor: string;
}

export type Agency = AuthState['agencias'] [number];