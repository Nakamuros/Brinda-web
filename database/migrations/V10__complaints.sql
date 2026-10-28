-- BRINDA · V10 · Libro de Reclamaciones virtual (Hoja de Reclamación)
-- Un campo por cada campo de la hoja (public/legal/hoja-reclamacion.pdf). Nada se borra (brinda_app sin DELETE):
-- las hojas y sus respuestas se conservan al menos dos años (plazo exacto por confirmar con el asesor).

-- Correlativo único por año: se incrementa de forma atómica dentro de la misma transacción del reclamo.
CREATE TABLE complaint_counters (
    year         SMALLINT PRIMARY KEY,
    last_number  INTEGER  NOT NULL,
    CONSTRAINT ck_complaint_counters_number CHECK (last_number > 0)
);

CREATE TABLE complaints (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Encabezado de la hoja: txtCorrelativo + txtAnio, código de identificación y fecha (dt_fecha)
    complaint_year      SMALLINT     NOT NULL,
    complaint_number    INTEGER      NOT NULL,
    code                VARCHAR(20)  NOT NULL UNIQUE,
    filed_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    -- SHA-256 (hex) del token de descarga de la copia; el token en claro solo lo recibe el consumidor al registrar
    copy_token_hash     CHAR(64)     NOT NULL UNIQUE,

    -- 1. Identificación del consumidor reclamante
    consumer_name       VARCHAR(160) NOT NULL,                 -- txtNombre
    document_type       VARCHAR(3)   NOT NULL,                 -- DNI / CE
    document_encrypted  VARCHAR(255) NOT NULL,                 -- txtDNI · AES-GCM como en los pedidos
    consumer_address    VARCHAR(255) NOT NULL,                 -- txtDomicilioReclamante
    consumer_phone      VARCHAR(20)  NOT NULL,                 -- txtTelefono
    consumer_email      VARCHAR(120) NOT NULL,                 -- txtCorreo
    guardian_name       VARCHAR(160),                          -- txtPadre (si es menor de edad)

    -- 2. Identificación del bien contratado
    good_type           VARCHAR(10)  NOT NULL,                 -- chkTipoBienProducto / chkTipoBienServicio
    claimed_amount      NUMERIC(10,2),                         -- txtMonto
    good_description    VARCHAR(500) NOT NULL,                 -- txtDescripcion

    -- 3. Detalle de la reclamación y pedido del consumidor
    complaint_type      VARCHAR(10)  NOT NULL,                 -- chkReclamo / chkQueja
    detail              TEXT         NOT NULL,                 -- txtDetalle
    consumer_request    TEXT         NOT NULL,                 -- txtPedido
    privacy_accepted_at TIMESTAMPTZ  NOT NULL,

    -- 4. Observaciones y acciones adoptadas por el proveedor
    status              VARCHAR(10)  NOT NULL DEFAULT 'RECEIVED',
    response_text       TEXT,                                  -- txtObservaciones
    response_date       DATE,                                  -- dtFechaRpta (fecha de comunicación de la respuesta)
    responded_by        UUID         REFERENCES users (id) ON DELETE RESTRICT,
    responded_at        TIMESTAMPTZ,

    -- Correos (el reclamo se guarda siempre primero; el envío va aparte y se reintenta)
    consumer_email_status          VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    consumer_email_attempts        INTEGER     NOT NULL DEFAULT 0,
    consumer_email_last_attempt_at TIMESTAMPTZ,
    consumer_email_sent_at         TIMESTAMPTZ,
    owner_email_status             VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    owner_email_attempts           INTEGER     NOT NULL DEFAULT 0,
    owner_email_last_attempt_at    TIMESTAMPTZ,
    owner_email_sent_at            TIMESTAMPTZ,

    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_complaints_year_number UNIQUE (complaint_year, complaint_number),
    CONSTRAINT ck_complaints_document_type CHECK (document_type IN ('DNI', 'CE')),
    CONSTRAINT ck_complaints_good_type CHECK (good_type IN ('PRODUCT', 'SERVICE')),
    CONSTRAINT ck_complaints_type CHECK (complaint_type IN ('CLAIM', 'COMPLAINT')),
    CONSTRAINT ck_complaints_status CHECK (status IN ('RECEIVED', 'ANSWERED')),
    CONSTRAINT ck_complaints_amount CHECK (claimed_amount IS NULL OR claimed_amount >= 0),
    CONSTRAINT ck_complaints_consumer_email_status CHECK (consumer_email_status IN ('PENDING', 'SENT', 'FAILED')),
    CONSTRAINT ck_complaints_owner_email_status CHECK (owner_email_status IN ('PENDING', 'SENT', 'FAILED')),
    CONSTRAINT ck_complaints_attempts CHECK (consumer_email_attempts >= 0 AND owner_email_attempts >= 0),
    CONSTRAINT ck_complaints_answered CHECK (status = 'RECEIVED' OR (response_text IS NOT NULL AND response_date IS NOT NULL))
);

CREATE INDEX idx_complaints_status_filed ON complaints (status, filed_at);
CREATE INDEX idx_complaints_filed ON complaints (filed_at DESC);
CREATE INDEX idx_complaints_email_retry ON complaints (consumer_email_status, owner_email_status)
    WHERE consumer_email_status <> 'SENT' OR owner_email_status <> 'SENT';

CREATE TRIGGER trg_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION set_updated_at();
