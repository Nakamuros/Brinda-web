# Post-despliegue en Render, con brinda_owner: (1) desactiva las zonas provisionales de V4 y (2) opcionalmente crea el admin real.
# Uso (desde la raíz del repo):  .\database\setup\run-render-postdeploy.ps1
# Todo lo sensible se pide oculto (Read-Host -AsSecureString) y viaja al contenedor por variables de entorno del proceso
# (docker run -e NOMBRE, sin valor en la línea de comandos); nada se escribe en archivos ni se imprime. Se borran al terminar.
# El hash BCrypt ($2y$, costo 12; Spring lo acepta) de la clave temporal se genera con htpasswd en httpd:alpine.
# Requisitos: solo Docker Desktop en marcha (postgres:16 como cliente psql y httpd:alpine para el hash; se descargan la primera vez).
$ErrorActionPreference = 'Stop'

function Read-Secret($prompt) {
    $s = Read-Host $prompt -AsSecureString
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}

docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker no responde: abre Docker Desktop y espera a "Engine running".' }

# (1) URL externa de brinda_owner
$ownerUrl = Read-Secret 'External Database URL de brinda_owner (postgres://brinda_owner:clave@host/base)'
try { $uri = [Uri]$ownerUrl } catch { throw 'La URL no es válida.' }
if ($uri.Scheme -notin 'postgres', 'postgresql') { throw 'La URL debe empezar por postgres:// o postgresql://' }
if ($uri.UserInfo -notlike 'brinda_owner:*') { throw 'La URL debe ser la de brinda_owner (no la del administrador de Render ni la de brinda_app).' }
$dbName = $uri.AbsolutePath.Trim('/')
if ($dbName -notmatch '^[A-Za-z0-9_]+$') { throw 'No pude leer el nombre de la base desde la URL.' }
if ($uri.Host -notlike '*.*') { throw 'El host no parece el externo (debe llevar dominio, p. ej. *.render.com); la URL interna no funciona desde tu PC.' }

# Datos del admin (opcional), pedidos antes de tocar la BD para fallar temprano
$createAdmin = (Read-Host '¿Crear también el admin real? (s/N)') -match '^(s|si|sí)$'
$adminUser = $adminEmail = $adminHash = $null
if ($createAdmin) {
    $adminUser = Read-Secret 'Usuario del admin'
    $adminEmail = Read-Secret 'Correo del admin'
    if ($adminUser -notmatch '^[A-Za-z0-9._-]{3,50}$') { throw 'Usuario inválido (3-50 caracteres: letras, números, . _ -).' }
    if ($adminEmail -notmatch '^[^@\s]+@[^@\s]+\.[^@\s]+$') { throw 'Correo inválido.' }
    if ($adminUser -ieq 'admin' -or $adminEmail -ieq 'admin@brinda.local') { throw 'No uses el usuario/correo del seed de desarrollo.' }
    $p1 = Read-Secret 'Clave temporal del admin (min. 12 caracteres)'
    $p2 = Read-Secret 'Repite la clave'
    if ($p1 -ne $p2) { throw 'Las claves no coinciden.' }
    if ($p1.Length -lt 12) { throw 'La clave debe tener al menos 12 caracteres.' }
    # Hash BCrypt costo 12 en un contenedor (sin JDK ni ~/.m2): la clave entra por stdin, nunca por argumentos.
    # tr quita el CR/LF que añade el pipe de PowerShell; UTF-8 sin BOM para que tildes y ñ lleguen intactas.
    # $global: es imprescindible: una asignación local no afecta al pipe y las tildes llegarían como "?".
    [Console]::OutputEncoding = $global:OutputEncoding = New-Object System.Text.UTF8Encoding $false
    $out = $p1 | & docker run --rm -i httpd:alpine sh -c 'tr -d ''\r\n'' | htpasswd -niBC 12 x'
    $p1 = $p2 = $null
    if ($LASTEXITCODE -ne 0 -or -not $out) { throw 'No se pudo generar el hash (¿Docker sin acceso para bajar httpd:alpine?).' }
    $adminHash = ($out | Where-Object { $_ } | Select-Object -Last 1).ToString().Trim() -replace '^x:', ''
    if ($adminHash -notmatch '^\$2[aby]\$12\$[./A-Za-z0-9]{53}$') { throw 'El hash generado no es BCrypt de costo 12.' }
}

Write-Host ""
Write-Host "Destino: host $($uri.Host) · base $dbName · rol brinda_owner" -ForegroundColor Cyan
Write-Host "Se hará: desactivar zonas provisionales$(if ($createAdmin) { ' + crear el admin real' })." -ForegroundColor Cyan
if ((Read-Host 'Escribe SI para continuar') -ne 'SI') { throw 'Cancelado.' }

$env:OWNER_URL = $ownerUrl; $env:PGSSLMODE = 'require'
$envNames = @('-e', 'OWNER_URL', '-e', 'PGSSLMODE')
if ($createAdmin) { $env:ADMIN_USER = $adminUser; $env:ADMIN_EMAIL = $adminEmail; $env:ADMIN_HASH = $adminHash
                    $envNames += @('-e', 'ADMIN_USER', '-e', 'ADMIN_EMAIL', '-e', 'ADMIN_HASH') }
$run = @('run', '--rm', '-i') + $envNames + @('-v', "${PSScriptRoot}:/sql:ro", 'postgres:16')
try {
    Write-Host "`n1/2 Zonas provisionales (deactivate_provisional_zones.sql)..." -ForegroundColor Cyan
    # -q oculta las etiquetas de comando (UPDATE n): solo salen las consultas de control
    & docker @run sh -c 'psql -q "$OWNER_URL" -v ON_ERROR_STOP=1 -f /sql/deactivate_provisional_zones.sql'
    if ($LASTEXITCODE -ne 0) { throw 'Falló la desactivación de zonas.' }

    if ($createAdmin) {
        Write-Host "`n2/2 Admin real (create_admin.sql)..." -ForegroundColor Cyan
        # Las variables de psql se cargan desde el entorno con \getenv (por stdin): nada sensible en argumentos.
        $pre = "\getenv admin_user ADMIN_USER`n\getenv admin_email ADMIN_EMAIL`n\getenv admin_hash ADMIN_HASH`n\i /sql/create_admin.sql`n"
        $pre | & docker @run sh -c 'psql -q "$OWNER_URL" -v ON_ERROR_STOP=1 -f -'
        if ($LASTEXITCODE -ne 0) { throw 'Falló la creación del admin (si ya existe, la restricción de unicidad lo rechaza).' }
        Write-Host "`nAdmin creado con must_change_password = TRUE: cambia la clave temporal en el primer ingreso." -ForegroundColor Green
    }
    Write-Host "`nListo." -ForegroundColor Green
}
finally {
    Remove-Item Env:OWNER_URL, Env:PGSSLMODE, Env:ADMIN_USER, Env:ADMIN_EMAIL, Env:ADMIN_HASH -ErrorAction SilentlyContinue
    $ownerUrl = $adminUser = $adminEmail = $adminHash = $null
}
