package com.papeleria.service;

import com.papeleria.dto.CategoriaDTO;
import com.papeleria.entity.Categoria;
import com.papeleria.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public Page<CategoriaDTO> findAll(String q, Boolean activo, Pageable pageable) {
        Page<Categoria> categorias = categoriaRepository.findByFilters(q, activo, pageable);
        return categorias.map(this::convertToDTO);
    }
    
    public CategoriaDTO findById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        return convertToDTO(categoria);
    }
    
    public CategoriaDTO save(Categoria categoria) {
        if (categoria.getId() != null) {
            // Actualización
            if (categoriaRepository.existsByNombreAndIdNot(categoria.getNombre(), categoria.getId())) {
                throw new RuntimeException("Ya existe una categoría con ese nombre");
            }
        } else {
            // Creación
            if (categoriaRepository.existsByNombre(categoria.getNombre())) {
                throw new RuntimeException("Ya existe una categoría con ese nombre");
            }
        }
        
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return convertToDTO(savedCategoria);
    }
    
    public CategoriaDTO updateActivo(Long id, Boolean activo) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        categoria.setActivo(activo);
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return convertToDTO(savedCategoria);
    }
    
    public void deleteById(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
    
    public List<CategoriaDTO> findAllActive() {
        List<Categoria> categorias = categoriaRepository.findByActivoTrue();
        return categorias.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Método para el frontend
    public List<CategoriaDTO> getCategoriasActivas() {
        return findAllActive();
    }
    
    private CategoriaDTO convertToDTO(Categoria categoria) {
        return new CategoriaDTO(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getDescripcion(),
            categoria.getActivo(),
            categoria.getCreatedAt(),
            categoria.getUpdatedAt()
        );
    }
}
