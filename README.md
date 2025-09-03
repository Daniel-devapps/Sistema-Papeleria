# Sistema de Gestión de Papelería

Sistema simple para gestionar categorías y productos de una papelería.

## Estructura del Proyecto

- backend - API REST con Spring Boot 3 + Java 17 + MySQL 8
- frontend - Aplicación Angular 17 + Material Design

## Requisitos Previos

- Java 17 o superior
- Node.js 18 o superior  
- MySQL 8
- Maven 3.6+
- Angular CLI 17 (npm install -g @angular/cli@17)

## Configuración de Base de Datos

1. **Crear base de datos MySQL:**
   sql
   CREATE DATABASE papeleriadb;
   

2. Configurar credenciales en `backend/src/main/resources/application.properties`:
   - Cambiar `username` y `password` según tu configuración de MySQL
   - Por defecto: usuario `root` con contraseña `123456789`

3. Query Base de datos

# Crear tabla de categorías

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

# Crear tabla de productos

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    sku VARCHAR(30) NOT NULL UNIQUE,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    categoria_id BIGINT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

# Crear índices para mejorar el rendimiento

CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

## Ejecutar Backend

1. Navegar a la carpeta backend:
cd backend

2. Ejecutar con Maven:
mvn spring-boot:run


El backend estará disponible en: http://localhost:8080

## Ejecutar Frontend

1. Navegar a la carpeta frontend:
cd frontend

2. Instalar dependencias:
npm install


3. Ejecutar aplicación:
ng serve


El frontend estará disponible en: http://localhost:4200

**Nota:** Asegúrate de que el backend esté ejecutándose antes de usar el frontend.

## Endpoints de la API

### Categorías
- `GET /api/categorias` - Listar categorías con paginación y filtros
- `POST /api/categorias` - Crear nueva categoría
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `PUT /api/categorias/{id}` - Actualizar categoría existente
- `PATCH /api/categorias/{id}/activo?value=true|false` - Activar/desactivar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría
- `GET /api/categorias/activas` - Obtener solo categorías activas

### Productos
- `GET /api/productos` - Listar productos con paginación y filtros
- `POST /api/productos` - Crear nuevo producto
- `GET /api/productos/{id}` - Obtener producto por ID
- `PUT /api/productos/{id}` - Actualizar producto existente
- `PATCH /api/productos/{id}/activo?value=true|false` - Activar/desactivar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Parámetros de Consulta
- `q` - Búsqueda por texto (nombre para categorías, nombre o SKU para productos)
- `categoriaId` - Filtrar productos por categoría
- `activo` - Filtrar por estado (true/false)
- `page` - Número de página (0-based)
- `size` - Tamaño de página
- `sort` - Ordenamiento (campo,dirección)

## Códigos de Error HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error de validación o datos incorrectos
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: nombre o SKU duplicado)
- **500**: Error interno del servidor

## Iniciar sistema .bat

- Iniciar sistema de ejecucion al sistema .bat