export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: {
    id: string;
    valor: string;
  };
  nombreCompleto: string;
  tenant: {
    id: string;
    valor: string;
  };
  client: {
    id: string;
    valor: string;
  };
  agencias: [];
}

export interface AuthState {
  token: string | null;
  username: string | null;
  rol: {
    id: string | null;
    valor: string | null;
  };
  nombreCompleto: string | null;
  tenant: {
    id: string | null;
    valor: string | null;
  };
  client: {
    id: string | null;
    valor: string | null;
  };
  agencias: [];
}
