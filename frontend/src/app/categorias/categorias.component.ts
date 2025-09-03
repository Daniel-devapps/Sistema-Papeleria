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
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-categorias',
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
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'activo', 'acciones'];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  currentSort = 'id,desc';

  searchControl = new FormControl('');
  statusControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadCategorias();
    
    // Agregar debounce para evitar demasiadas llamadas
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadCategorias();
    });

    this.statusControl.valueChanges.subscribe(() => {
      this.currentPage = 0;
      this.loadCategorias();
    });
  }

  loadCategorias() {
    const searchValue = this.searchControl.value || '';
    const statusValue = this.statusControl.value;
    

    // Convertir el valor del estado correctamente
    let activoValue: boolean | undefined;
    if (statusValue == '1') //1=activo
    {
      activoValue = true;
    } else if (statusValue == '0')  //0=inactivo
    {
      activoValue = false;
    } else {
      activoValue = undefined; 
    }
    
    this.categoriaService.getCategorias(
      searchValue, 
      activoValue, 
      this.currentPage, 
      this.pageSize, 
      this.currentSort
    ).subscribe({
      next: (data) => {
        this.categorias = data.content;
        this.totalElements = data.totalElements;
      },
      error: (error: any) => {
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategorias();
  }

  //Actualizar categoria estado (el ojito)

  toggleActivo(categoria: Categoria) {
    const newStatus = !categoria.activo;
    const action = newStatus ? 'activada' : 'desactivada';
    
    this.categoriaService.updateActivo(categoria.id!, newStatus).subscribe({
      next: () => {
        categoria.activo = newStatus;
        this.snackBar.open(`Categoría ${action} exitosamente`, 'Cerrar', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Error al cambiar estado', 'Cerrar', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }

  //Eliminar categoria
  deleteCategoria(id: number) {
    if (confirm('¿Está seguro de que desea eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.snackBar.open('Categoría eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadCategorias();
        },
        error: (error: any) => {
          this.snackBar.open('Error al eliminar categoría', 'Cerrar', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }
}
