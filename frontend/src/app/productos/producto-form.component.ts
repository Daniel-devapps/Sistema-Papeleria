import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductoService } from '../services/producto.service';
import { CategoriaService } from '../services/categoria.service';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  isEditMode = false;
  productoId?: number;
  isSubmitting = false;
  categorias: Categoria[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      sku: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: ['', [Validators.required]],
      activo: [true]
    });
  }

  ngOnInit() {
    this.loadCategorias();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productoId = +params['id'];
        this.loadProducto();
      }
    });
  }

  loadCategorias() {
    this.categoriaService.getCategoriasActivas().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error: any) => {
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
        console.error('Error:', error);
      }
    });
  }

  loadProducto() {
    if (this.productoId) {
      this.productoService.getProducto(this.productoId).subscribe({
        next: (producto) => {
          this.productoForm.patchValue({
            nombre: producto.nombre,
            sku: producto.sku,
            precio: producto.precio,
            stock: producto.stock,
            categoriaId: producto.categoriaId,
            activo: producto.activo
          });
        },
        error: (error: any) => {
          this.snackBar.open('Error al cargar producto', 'Cerrar', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.productoForm.valid) {
      this.isSubmitting = true;
      const formValue = this.productoForm.value;
      
      // Convertir categoriaId a número y validar que no esté vacío
      if (!formValue.categoriaId || formValue.categoriaId === '') {
        this.snackBar.open('Debe seleccionar una categoría', 'Cerrar', { duration: 3000 });
        this.isSubmitting = false;
        return;
      }

      const productoData: Producto = {
        ...formValue,
        categoriaId: Number(formValue.categoriaId),
        precio: Number(formValue.precio),
        stock: Number(formValue.stock)
      };

      if (this.isEditMode && this.productoId) {
        this.productoService.updateProducto(this.productoId, productoData).subscribe({
          next: () => {
            this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/productos']);
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.snackBar.open('Error al actualizar producto', 'Cerrar', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      } else {
        this.productoService.createProducto(productoData).subscribe({
          next: () => {
            this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/productos']);
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.snackBar.open('Error al crear producto', 'Cerrar', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    }
  }
}
