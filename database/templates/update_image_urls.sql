-- BRINDA · PLANTILLA (no es migración; no la pongas en database/migrations)
-- Carga manual de fotos: actualiza products.image_url por código (sku) a partir de una lista código → ruta o URL.
-- Ruta relativa ("products/WHI-001.webp"): se antepone IMAGES_BASE_URL al responder, así cambiar de almacenamiento no toca los datos.
-- URL absoluta ("https://..."): se devuelve tal cual. Cadena vacía → se guarda NULL (la API omite la imagen y el frontend muestra la genérica).
-- Ejecutar con el usuario dueño (brinda_owner) o uno con UPDATE sobre products. Revisa el resultado y confirma con COMMIT.

BEGIN;

UPDATE products p
SET    image_url = NULLIF(btrim(v.image), '')
FROM  (VALUES
          ('SKU-0001', 'products/SKU-0001.webp'),
          ('SKU-0002', 'products/SKU-0002.webp'),
          ('SKU-0003', 'https://cdn.ejemplo.com/otra-ruta/SKU-0003.webp')
      ) AS v(sku, image)
WHERE  p.sku = v.sku;

-- Códigos de la lista que no existen en products (deben salir 0 filas):
SELECT v.sku
FROM  (VALUES ('SKU-0001'), ('SKU-0002'), ('SKU-0003')) AS v(sku)
LEFT JOIN products p ON p.sku = v.sku
WHERE  p.id IS NULL;

-- Productos que siguen sin foto:
SELECT sku, name FROM products WHERE image_url IS NULL ORDER BY name;

COMMIT;  -- cambia a ROLLBACK; si algo no cuadra
