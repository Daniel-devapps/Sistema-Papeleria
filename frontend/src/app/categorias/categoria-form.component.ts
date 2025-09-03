import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  isEditMode = false;
  categoriaId?: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      descripcion: [''],
      activo: [true]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoriaId = +params['id'];
        this.loadCategoria();
      }
    });
  }

  loadCategoria() {
    if (this.categoriaId) {
      this.categoriaService.getCategoria(this.categoriaId).subscribe({
        next: (categoria) => {
          this.categoriaForm.patchValue({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            activo: categoria.activo
          });
        },
        error: (error: any) => {
          this.snackBar.open('Error al cargar categoría', 'Cerrar', { duration: 3000 });
          console.error('Error:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      this.isSubmitting = true;
      const categoriaData: Categoria = this.categoriaForm.value;

      if (this.isEditMode && this.categoriaId) {
        this.categoriaService.updateCategoria(this.categoriaId, categoriaData).subscribe({
          next: () => {
            this.snackBar.open('Categoría actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/categorias']);
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.snackBar.open('Error al actualizar categoría', 'Cerrar', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      } else {
        this.categoriaService.createCategoria(categoriaData).subscribe({
          next: () => {
            this.snackBar.open('Categoría creada exitosamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/categorias']);
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.snackBar.open('Error al crear categoría', 'Cerrar', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }
    }
  }
}
