# Solicitudes ARCO sobre pedidos con database/setup/arco.sql y brinda_owner (ver PROCEDIMIENTO-ARCO.md).
# Uso (desde la raíz del repo):
#   .\database\setup\run-arco.ps1            # producción (Render): conexión externa con SSL
#   .\database\setup\run-arco.ps1 -Local     # BD local de Docker (brinda-db, sin SSL)
# Por defecto SIMULA (no guarda). Para guardar, el script lo pregunta al final y exige escribir APLICAR.
# La URL (con la clave), el celular y los códigos se piden por Read-Host y viajan al contenedor por variables de
# entorno (docker run -e NOMBRE, sin valor en la línea de comandos); nada se escribe en archivos ni se imprime.
# Requisito: Docker Desktop en marcha (postgres:16 como cliente psql; se descarga la primera vez).
param([switch]$Local)
$ErrorActionPreference = 'Stop'

function Read-Secret($prompt) {
    $s = Read-Host $prompt -AsSecureString
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}

docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker no responde: abre Docker Desktop y espera a "Engine running".' }

$hint = if ($Local) { 'postgres://brinda_owner:clave@host.docker.internal:5433/brinda' } else { 'External Database URL de Render con el usuario brinda_owner' }
$ownerUrl = Read-Secret "URL de brinda_owner ($hint)"
try { $uri = [Uri]$ownerUrl } catch { throw 'La URL no es válida.' }
if ($uri.Scheme -notin 'postgres', 'postgresql') { throw 'La URL debe empezar por postgres:// o postgresql://' }
if ($uri.UserInfo -notlike 'brinda_owner:*') { throw 'La URL debe ser la de brinda_owner (no la del administrador de Render ni la de brinda_app).' }
if (-not $Local -and $uri.Host -notlike '*.*') { throw 'El host no parece el externo (debe llevar dominio, p. ej. *.render.com); la URL interna no funciona desde tu PC.' }

$action = Read-Host 'Acción: list | revoke-marketing | anonymize'
if ($action -notin 'list', 'revoke-marketing', 'anonymize') { throw 'Acción inválida.' }
$phone = Read-Secret 'Celular del titular (9 dígitos)'
if ($phone -notmatch '^[0-9]{9}$') { throw 'El celular debe tener 9 dígitos.' }
$codes = ''
if ($action -ne 'list') {
    $codes = (Read-Host 'Códigos de pedido verificados en el panel, separados por comas').ToUpper() -replace '\s', ''
    if ($codes -notmatch '^[A-Z]{2}\d{2,4}(,[A-Z]{2}\d{2,4})*$') { throw 'Códigos inválidos (ej.: EQ12,AB345).' }
}
$includeConfirmed = '0'
if ($action -eq 'anonymize' -and (Read-Host '¿Incluir pedidos CONFIRMADOS? Solo con OK de la asesora/contador (s/N)') -match '^(s|si|sí)$') {
    $includeConfirmed = '1'
}

Write-Host ""
Write-Host "Destino: host $($uri.Host) · base $($uri.AbsolutePath.Trim('/')) · rol brinda_owner" -ForegroundColor Cyan

$env:OWNER_URL = $ownerUrl; $env:PGSSLMODE = if ($Local) { 'disable' } else { 'require' }
$env:ARCO_ACTION = $action; $env:ARCO_PHONE = $phone; $env:ARCO_CODES = $codes; $env:ARCO_CONFIRMED = $includeConfirmed
$run = @('run', '--rm', '-i', '-e', 'OWNER_URL', '-e', 'PGSSLMODE', '-e', 'ARCO_ACTION', '-e', 'ARCO_PHONE',
         '-e', 'ARCO_CODES', '-e', 'ARCO_CONFIRMED', '-v', "${PSScriptRoot}:/sql:ro", 'postgres:16')
# Las variables de psql se cargan desde el entorno con \getenv (por stdin): nada sensible en argumentos.
function Invoke-Arco($apply) {
    $pre = "\getenv action ARCO_ACTION`n\getenv phone ARCO_PHONE`n\getenv codes ARCO_CODES`n" +
           "\getenv include_confirmed ARCO_CONFIRMED`n\set apply $apply`n\i /sql/arco.sql`n"
    $pre | & docker @run sh -c 'psql -X "$OWNER_URL" -v ON_ERROR_STOP=1 -f -'
    if ($LASTEXITCODE -ne 0) { throw 'El script ARCO falló (no se guardó nada).' }
}
try {
    Write-Host "`nSimulación (no guarda):" -ForegroundColor Cyan
    Invoke-Arco 0
    if ($action -ne 'list' -and (Read-Host "`n¿Guardar exactamente estos cambios? Escribe APLICAR") -ceq 'APLICAR') {
        Invoke-Arco 1
        Write-Host "`nListo. Anota la solicitud en el registro ARCO (fuera del repo)." -ForegroundColor Green
    } elseif ($action -ne 'list') {
        Write-Host "`nNo se guardó nada." -ForegroundColor Yellow
    }
} finally {
    foreach ($n in 'OWNER_URL', 'PGSSLMODE', 'ARCO_ACTION', 'ARCO_PHONE', 'ARCO_CODES', 'ARCO_CONFIRMED') {
        Remove-Item "Env:$n" -ErrorAction SilentlyContinue
    }
    $ownerUrl = $phone = $null
}
