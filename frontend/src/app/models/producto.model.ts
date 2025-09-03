export interface Producto {
  id?: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  categoriaId: number;
  categoriaNombre?: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductoPage {
  content: Producto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
