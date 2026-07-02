export interface AuthCredentials {
  username: string;
  password: string;
}

export interface CatalogValue {
  id: number;
  valor: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: CatalogValue;
  nombreCompleto: string;
  tenant: CatalogValue;
  client: CatalogValue;
  agencias: CatalogValue[];
}

export interface AuthState extends AuthResponse {}
