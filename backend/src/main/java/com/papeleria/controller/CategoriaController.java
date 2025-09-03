package com.papeleria.controller;

import com.papeleria.dto.CategoriaDTO;
import com.papeleria.entity.Categoria;
import com.papeleria.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categorias") // asegura que todos los enpoinds siempore lleven la base de /api/categorias
@CrossOrigin(origins = "http://localhost:4200") // permite las peticiones de front
public class CategoriaController {
    
    @Autowired
    private CategoriaService categoriaService;

    //lista las categeorias con los filtros
    @GetMapping
    public ResponseEntity<Page<CategoriaDTO>> findAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction sortDirection = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<CategoriaDTO> categorias = categoriaService.findAll(q, activo, pageable);
        
        return ResponseEntity.ok(categorias);
    }
    
    //Busca una categoría por su ID.
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> findById(@PathVariable Long id) {
        CategoriaDTO categoria = categoriaService.findById(id);
        return ResponseEntity.ok(categoria);
    }
    
    //Crea una nueva categoría a partir del cuerpo recibido en JSON.
    @PostMapping
    public ResponseEntity<CategoriaDTO> create(@Valid @RequestBody Categoria categoria) {
        CategoriaDTO savedCategoria = categoriaService.save(categoria);
        return ResponseEntity.ok(savedCategoria);
    }

    //Actualiza una categoría completa, reemplazando sus datos.
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> update(@PathVariable Long id, @Valid @RequestBody Categoria categoria) {
        categoria.setId(id);
        CategoriaDTO updatedCategoria = categoriaService.save(categoria);
        return ResponseEntity.ok(updatedCategoria);
    }

    //Solo cambia el estado activo/inactivo de la categoría.
    @PatchMapping("/{id}/activo")
    public ResponseEntity<CategoriaDTO> updateActivo(
            @PathVariable Long id, 
            @RequestParam Boolean value) {
        CategoriaDTO updatedCategoria = categoriaService.updateActivo(id, value);
        return ResponseEntity.ok(updatedCategoria);
    }
    
    //Elimina la categoría por ID.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //Lista únicamente las categorías activas.
    @GetMapping("/activas")
    public ResponseEntity<List<CategoriaDTO>> findAllActive() {
        List<CategoriaDTO> categorias = categoriaService.findAllActive();
        return ResponseEntity.ok(categorias);
    }
}
