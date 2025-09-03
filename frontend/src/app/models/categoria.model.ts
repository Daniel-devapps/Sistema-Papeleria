export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoriaPage {
  content: Categoria[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
