-- BRINDA · V3 · Datos iniciales (solo desarrollo / pruebas con Postman)
-- Las tarifas de zonas y la asignación de distritos son PROVISIONALES hasta que Lucía entregue la lista real.

-- ============================================================
-- USUARIO ADMIN
-- Clave inicial: ver database/README.md. must_change_password = true obliga a cambiarla en el primer ingreso.
-- ============================================================
INSERT INTO users (username, email, password_hash, role, active, must_change_password) VALUES
    ('admin', 'admin@brinda.local', '$2b$12$bKfyji.DGHclBbxgRLjX2eXqIJddK0rHAy4aAWjBk63S5bJOHl7vi', 'ROLE_ADMIN', TRUE, TRUE);

-- ============================================================
-- CATEGORÍAS
-- ============================================================
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Piscos y Whiskys', 'piscos-y-whiskys', 'Destilados y licores seleccionados', 1),
    ('Snacks',           'snacks',           'Piqueos para acompañar',             2),
    ('Hielo y Bebidas',  'hielo-y-bebidas',  'Hielo, gaseosas y mezcladores',      3);

-- ============================================================
-- PRODUCTOS DE EJEMPLO
-- ============================================================
INSERT INTO products (category_id, sku, name, slug, description, price, discount_price, stock_quantity, min_stock, max_stock, is_featured)
SELECT c.id, v.sku, v.name, v.slug, v.description, v.price, v.discount_price, v.stock, v.min_stock, v.max_stock, v.featured
FROM (VALUES
    ('piscos-y-whiskys', 'PIS-001', 'Pisco Quebranta 500 ml',        'pisco-quebranta-500ml',  'Pisco puro de uva quebranta',        48.00::numeric,  NULL::numeric, 24, 6, 36, TRUE),
    ('piscos-y-whiskys', 'WHI-001', 'Whisky Etiqueta Negra 750 ml',  'whisky-etiqueta-negra-750ml', 'Blended scotch whisky 12 años', 159.90::numeric, 149.90::numeric, 12, 3, 20, TRUE),
    ('piscos-y-whiskys', 'WHI-002', 'Whisky Reserva 1 L',            'whisky-reserva-1l',      'Whisky de gran reserva, edición 1 L', 259.00::numeric, NULL::numeric, 6, 2, 10, FALSE),
    ('snacks',           'SNK-001', 'Piqueo Mixto 200 g',            'piqueo-mixto-200g',      'Maní, habas y cancha',                 9.50::numeric,  NULL::numeric, 40, 10, 60, FALSE),
    ('hielo-y-bebidas',  'ICE-001', 'Bolsa de Hielo 2 kg',           'bolsa-hielo-2kg',        'Hielo en cubos para la reunión',       8.00::numeric,  NULL::numeric, 30, 12, 50, FALSE)
) AS v(cat_slug, sku, name, slug, description, price, discount_price, stock, min_stock, max_stock, featured)
JOIN categories c ON c.slug = v.cat_slug;

-- Stock inicial registrado como movimiento (todo cambio de stock deja rastro)
INSERT INTO stock_movements (product_id, created_by, movement_type, quantity_change, stock_after, reason)
SELECT p.id, u.id, 'RESTOCK', p.stock_quantity, p.stock_quantity, 'Stock inicial (seed)'
FROM products p CROSS JOIN users u
WHERE u.username = 'admin' AND p.stock_quantity > 0;

-- ============================================================
-- ZONAS Y DISTRITOS (PROVISIONAL)
-- ============================================================
INSERT INTO delivery_zones (name, fee) VALUES
    ('Zona 1 - Cercanos', 6.00),
    ('Zona 2 - Medios',   9.00),
    ('Zona 3 - Lejanos',  13.00);

INSERT INTO districts (zone_id, name)
SELECT z.id, d.name
FROM (VALUES
    ('Zona 1 - Cercanos', 'Miraflores'),
    ('Zona 1 - Cercanos', 'San Isidro'),
    ('Zona 1 - Cercanos', 'Barranco'),
    ('Zona 1 - Cercanos', 'Surquillo'),
    ('Zona 1 - Cercanos', 'San Borja'),
    ('Zona 1 - Cercanos', 'Santiago de Surco'),
    ('Zona 2 - Medios',   'Lince'),
    ('Zona 2 - Medios',   'Jesús María'),
    ('Zona 2 - Medios',   'Magdalena del Mar'),
    ('Zona 2 - Medios',   'Pueblo Libre'),
    ('Zona 2 - Medios',   'San Miguel'),
    ('Zona 2 - Medios',   'Lima (Cercado)'),
    ('Zona 2 - Medios',   'La Victoria'),
    ('Zona 2 - Medios',   'La Molina'),
    ('Zona 2 - Medios',   'Chorrillos'),
    ('Zona 2 - Medios',   'San Luis'),
    ('Zona 3 - Lejanos',  'Callao'),
    ('Zona 3 - Lejanos',  'Los Olivos'),
    ('Zona 3 - Lejanos',  'San Juan de Lurigancho'),
    ('Zona 3 - Lejanos',  'Villa El Salvador')
) AS d(zone_name, name)
JOIN delivery_zones z ON z.name = d.zone_name;
