export interface Cliente {
  idCliente: number;
  cliente: string;
}

export interface CatalogValue {
  id: number;
  valor: string;
}

export interface Agencia {
  idAgencia: number;
  agencia: string;
  latitud: string;
  longitud: string;
  direccion: string;
  departamento: CatalogValue;
  provincia: CatalogValue;
  distrito: CatalogValue;
  zona: CatalogValue;
  ubicacion: CatalogValue;
  empresa: CatalogValue;
  cliente: CatalogValue;
}
