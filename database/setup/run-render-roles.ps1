# Crea brinda_owner y brinda_app en el Postgres de Render y verifica el resultado.
# Uso (desde la raíz del repo):  .\database\setup\run-render-roles.ps1
# Pide de forma oculta: URL externa del administrador, clave nueva de brinda_owner y clave nueva de brinda_app.
# Nada se escribe en archivos ni se imprime: viajan al contenedor por variables de entorno del proceso
# (docker run -e NOMBRE, sin valor en la línea de comandos) y se borran al terminar.
# Requisitos: Docker Desktop en marcha (usa postgres:16 solo como cliente psql).
$ErrorActionPreference = 'Stop'

function Read-Secret($prompt) {
    $s = Read-Host $prompt -AsSecureString
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}

docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker no responde: abre Docker Desktop y espera a "Engine running".' }

$adminUrl = Read-Secret 'URL externa del administrador (postgres://usuario:clave@host/base)'
try { $uri = [Uri]$adminUrl } catch { throw 'La URL no es válida.' }
if ($uri.Scheme -notin 'postgres', 'postgresql') { throw 'La URL debe empezar por postgres:// o postgresql://' }
$dbName = $uri.AbsolutePath.Trim('/')
if ($dbName -notmatch '^[A-Za-z0-9_]+$') { throw 'No pude leer el nombre de la base desde la URL.' }
if ($uri.Host -notlike '*.*') { throw 'El host no parece el externo (debe llevar dominio, p. ej. *.render.com); la URL interna no funciona desde tu PC.' }

$ownerPw = Read-Secret 'Clave NUEVA de brinda_owner (min. 20 caracteres)'
$ownerPw2 = Read-Secret 'Repite la clave de brinda_owner'
$appPw = Read-Secret 'Clave NUEVA de brinda_app (min. 20 caracteres)'
$appPw2 = Read-Secret 'Repite la clave de brinda_app'
if ($ownerPw -ne $ownerPw2 -or $appPw -ne $appPw2) { throw 'Alguna confirmación no coincide.' }
if ($ownerPw.Length -lt 20 -or $appPw.Length -lt 20) { throw 'Las claves deben tener al menos 20 caracteres.' }
if ($ownerPw -eq $appPw) { throw 'brinda_owner y brinda_app deben tener claves distintas.' }

Write-Host ""
Write-Host "Destino: host $($uri.Host) · base $dbName" -ForegroundColor Cyan
if ((Read-Host 'Escribe SI para crear los roles en esa base') -ne 'SI') { throw 'Cancelado.' }

# Variables solo para este proceso; el contenedor las hereda por nombre.
$env:ADMIN_URL = $adminUrl; $env:OWNER_PW = $ownerPw; $env:APP_PW = $appPw
$env:DBNAME = $dbName; $env:PGSSLMODE = 'require'
$sqlDir = $PSScriptRoot
$run = @('run', '--rm', '-e', 'ADMIN_URL', '-e', 'OWNER_PW', '-e', 'APP_PW', '-e', 'DBNAME', '-e', 'PGSSLMODE',
         '-v', "${sqlDir}:/sql:ro", 'postgres:16')
try {
    Write-Host "`n1/2 Creando roles (01b_render_roles.sql)..." -ForegroundColor Cyan
    & docker @run sh -c 'psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -v db="$DBNAME" -v owner_password="$OWNER_PW" -v app_password="$APP_PW" -f /sql/01b_render_roles.sql'
    if ($LASTEXITCODE -ne 0) { throw 'Falló la creación de roles (la transacción se revirtió; no quedó nada a medias).' }

    Write-Host "`n2/2 Verificando (verify_render_roles.sql)..." -ForegroundColor Cyan
    & docker @run sh -c 'psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -f /sql/verify_render_roles.sql'
    if ($LASTEXITCODE -ne 0) { throw 'Falló la verificación.' }

    Write-Host "`nListo. Guarda las dos claves en tu gestor: van como DB_OWNER_PASSWORD y DB_APP_PASSWORD en Render." -ForegroundColor Green
}
finally {
    Remove-Item Env:ADMIN_URL, Env:OWNER_PW, Env:APP_PW, Env:DBNAME, Env:PGSSLMODE -ErrorAction SilentlyContinue
    $adminUrl = $ownerPw = $ownerPw2 = $appPw = $appPw2 = $null
}
