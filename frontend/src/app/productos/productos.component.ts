import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime } from 'rxjs/operators';
import { ProductoService } from '../services/producto.service';
import { CategoriaService } from '../services/categoria.service';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'sku', 'precio', 'stock', 'categoria', 'activo', 'acciones'];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  currentSort = 'id,desc';

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  statusControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProductos();
    this.loadCategorias();
    
    // Agregar debounce para evitar demasiadas llamadas
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProductos();
    });

    this.categoryControl.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadProductos();
    });

    this.statusControl.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadProductos();
    });
  }

  loadProductos() {
    const searchValue = this.searchControl.value || '';
    const categoryValue = this.categoryControl.value;
    const statusValue = this.statusControl.value;
    
    // Convertir el valor del estado correctamente del filtro estado
    let activoValue: boolean | undefined;
    if (statusValue == '1') {
      activoValue = true;
    } else if (statusValue == '0') {
      activoValue = false;
    } else {
      activoValue = undefined; 
    }
  
    this.productoService.getProductos(
      searchValue, 
      categoryValue === '' ? undefined : Number(categoryValue), 
      activoValue, 
      this.currentPage, 
      this.pageSize, 
      this.currentSort
    ).subscribe({
      next: (data) => {
        this.productos = data.content;
        this.totalElements = data.totalElements;
      },
      error: (error: any) => {
        this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }

  loadCategorias() {
    this.categoriaService.getCategoriasActivas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error: any) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProductos();
  }

    //Actualizar producto del estado (ojito)
  toggleActivo(producto: Producto) {
    const newStatus = !producto.activo;
    const action = newStatus ? 'activado' : 'desactivado';
    
    this.productoService.updateActivo(producto.id!, newStatus).subscribe({
      next: () => {
        producto.activo = newStatus;
        this.snackBar.open(`Producto ${action} exitosamente`, 'Cerrar', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Error al cambiar estado', 'Cerrar', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }


  //Eliminar producto
  deleteProducto(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadProductos();
        },
        error: (error: any) => {
          this.snackBar.open('Error al eliminar producto', 'Cerrar', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }
}
