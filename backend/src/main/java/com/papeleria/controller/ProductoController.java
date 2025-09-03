package com.papeleria.controller;

import com.papeleria.dto.ProductoDTO;
import com.papeleria.dto.ProductoCreateDTO;
import com.papeleria.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<Page<ProductoDTO>> findAll(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction sortDirection = sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1]) 
            ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));
        Page<ProductoDTO> productos = productoService.findAll(q, categoriaId, activo, pageable);
        
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> findById(@PathVariable Long id) {
        ProductoDTO producto = productoService.findById(id);
        return ResponseEntity.ok(producto);
    }
    
    @PostMapping
    public ResponseEntity<ProductoDTO> create(@Valid @RequestBody ProductoCreateDTO productoDTO) {
        ProductoDTO savedProducto = productoService.save(productoDTO);
        return ResponseEntity.ok(savedProducto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> update(@PathVariable Long id, @Valid @RequestBody ProductoCreateDTO productoDTO) {
        ProductoDTO updatedProducto = productoService.update(id, productoDTO);
        return ResponseEntity.ok(updatedProducto);
    }
    
    @PatchMapping("/{id}/activo")
    public ResponseEntity<ProductoDTO> updateActivo(
            @PathVariable Long id, 
            @RequestParam Boolean value) {
        ProductoDTO updatedProducto = productoService.updateActivo(id, value);
        return ResponseEntity.ok(updatedProducto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
