# RetroStock

Gestor de inventario y ventas de una tienda de videojuegos retro. Funciona por consola con `prompt()`.

## Cómo ejecutarlo

```bash
docker compose up -d
docker exec -it mi-proyecto-dev bash
npm install
npm run dev -- --host
```

Abrir `http://localhost:5173`, abrir la consola (F12) y pulsar **Abrir menú**.

## Organización del código

```
src/
  modelo-datos/
    catalogo-productos.js    
    estado-conservacion.js 
  logica/
    reglas.js              
    inventario.js           
    consultas.js           
  ui/
    menu.js                
  main.js                   
```

## Modelo de datos

Cada producto es un objeto con:

| Campo | Tipo | Ejemplo |
|---|---|---|
| id | number | 6 |
| titulo | string | "GoldenEye 007" |
| plataforma | string | "Nintendo 64" |
| categoria | string | "shooter" |
| precioBase | number | 34.99 |
| estadoConservacion | string | "usado-como-nuevo" |
| stock | number | 7 |

El catálogo nunca se modifica: vender y reponer devuelven un array nuevo con `map` y spread.

```