export interface AuthCredentials {
  username: string;
  password: string;
}

export interface CatalogValue {
  id: number;
  valor: string;
}

export interface Branding {
  idTenantConfig: number;
  idTenant: number;
  logoGrandeUrl: string;
  logoPequenoUrl: string;
  colorPrimario: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: CatalogValue;
  nombreCompleto: string;
  tenant: CatalogValue;
  client: CatalogValue;
  branding: Branding;
  agencias: CatalogValue[];
}

export interface AuthState extends AuthResponse {}
