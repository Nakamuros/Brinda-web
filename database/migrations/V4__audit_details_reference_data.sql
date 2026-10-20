-- BRINDA · V4 · Detalle en auditoría + datos de referencia de reparto
-- (el seed de desarrollo V3 vive en database/seed-dev y no corre en producción)

-- Valor anterior -> valor nuevo. Nunca datos personales.
ALTER TABLE audit_logs ADD COLUMN details TEXT;
ALTER TABLE audit_logs ADD CONSTRAINT ck_audit_details_len CHECK (details IS NULL OR length(details) <= 500);

-- Zonas y distritos: necesarios también en producción. Tarifas PROVISIONALES hasta tener la lista real.
-- En una base que ya los tiene (desarrollo) no hace nada.
INSERT INTO delivery_zones (name, fee) VALUES
    ('Zona 1 - Cercanos', 6.00),
    ('Zona 2 - Medios',   9.00),
    ('Zona 3 - Lejanos',  13.00)
ON CONFLICT (name) DO NOTHING;

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
JOIN delivery_zones z ON z.name = d.zone_name
ON CONFLICT (name) DO NOTHING;
