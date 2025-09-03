package com.papeleria.repository;

import com.papeleria.entity.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    @Query("SELECT c FROM Categoria c WHERE " +
           "(:q IS NULL OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))) AND " +
           "(:activo IS NULL OR c.activo = :activo)")
    Page<Categoria> findByFilters(@Param("q") String q, 
                                 @Param("activo") Boolean activo, 
                                 Pageable pageable);
    
    boolean existsByNombre(String nombre);
    
    boolean existsByNombreAndIdNot(String nombre, Long id);
    
    // Método para encontrar categorías activas
    java.util.List<Categoria> findByActivoTrue();
}
