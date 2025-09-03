package com.papeleria.service;

import com.papeleria.dto.ProductoDTO;
import com.papeleria.dto.ProductoCreateDTO;
import com.papeleria.entity.Categoria;
import com.papeleria.entity.Producto;
import com.papeleria.repository.CategoriaRepository;
import com.papeleria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public Page<ProductoDTO> findAll(String q, Long categoriaId, Boolean activo, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByFilters(q, categoriaId, activo, pageable);
        return productos.map(this::convertToDTO);
    }
    
    // Método para el frontend
    public Page<ProductoDTO> getProductos(String q, Long categoriaId, Boolean activo, int page, int size, String sort) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, 
            org.springframework.data.domain.Sort.by(sort.contains(",") ? 
                org.springframework.data.domain.Sort.Direction.fromString(sort.split(",")[1]) : 
                org.springframework.data.domain.Sort.Direction.DESC, 
                sort.contains(",") ? sort.split(",")[0] : sort));
        return findAll(q, categoriaId, activo, pageable);
    }
    
    public ProductoDTO findById(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return convertToDTO(producto);
    }
    
      public ProductoDTO save(ProductoCreateDTO productoDTO) {
    // Validar que la categoría existe
    Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    
    // Validar SKU único
    if (productoRepository.existsBySku(productoDTO.getSku())) {
      throw new RuntimeException("Ya existe un producto con ese SKU");
    }
    
    Producto producto = new Producto();
    producto.setNombre(productoDTO.getNombre());
    producto.setSku(productoDTO.getSku());
    producto.setPrecio(productoDTO.getPrecio());
    producto.setStock(productoDTO.getStock());
    producto.setCategoria(categoria);
    producto.setActivo(productoDTO.getActivo() != null ? productoDTO.getActivo() : true);
    
    Producto savedProducto = productoRepository.save(producto);
    return convertToDTO(savedProducto);
  }
  
  public ProductoDTO update(Long id, ProductoCreateDTO productoDTO) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    
    // Validar que la categoría existe
    Categoria categoria = categoriaRepository.findById(productoDTO.getCategoriaId())
        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    
    // Validar SKU único (excluyendo el producto actual)
    if (productoRepository.existsBySkuAndIdNot(productoDTO.getSku(), id)) {
      throw new RuntimeException("Ya existe un producto con ese SKU");
    }
    
    producto.setNombre(productoDTO.getNombre());
    producto.setSku(productoDTO.getSku());
    producto.setPrecio(productoDTO.getPrecio());
    producto.setStock(productoDTO.getStock());
    producto.setCategoria(categoria);
    producto.setActivo(productoDTO.getActivo() != null ? productoDTO.getActivo() : true);
    
    Producto savedProducto = productoRepository.save(producto);
    return convertToDTO(savedProducto);
  }
    
    public ProductoDTO updateActivo(Long id, Boolean activo) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        
        producto.setActivo(activo);
        Producto savedProducto = productoRepository.save(producto);
        return convertToDTO(savedProducto);
    }
    
    public void deleteById(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productoRepository.deleteById(id);
    }
    
    private ProductoDTO convertToDTO(Producto producto) {
        return new ProductoDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getSku(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getCategoria().getId(),
            producto.getCategoria().getNombre(),
            producto.getActivo(),
            producto.getCreatedAt(),
            producto.getUpdatedAt()
        );
    }
}
