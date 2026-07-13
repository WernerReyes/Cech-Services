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
  logoGrandeEscala: number;
  logoPequenoUrl: string;
  logoPequenoEscala: number;
  colorPrimario: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  duracionSesionSegundos: number;
  segundosRestantesSesion: number;
  rol: CatalogValue;
  fechaExpiracionSesion: string;
  nombreCompleto: string;
  tenant: CatalogValue;
  client: CatalogValue;
  branding: Branding;
  agencias: CatalogValue[];
}

export interface AuthState extends AuthResponse {}
