-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion, activo) VALUES 
('Papelería Escolar', 'Productos para uso escolar y oficina', TRUE),
('Tecnología', 'Productos tecnológicos y electrónicos', TRUE);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, sku, precio, stock, categoria_id, activo) VALUES 
('Lápiz HB', 'LAP-HB-001', 0.50, 100, 1, TRUE),
('Cuaderno A4', 'CUA-A4-001', 2.50, 50, 1, TRUE);
