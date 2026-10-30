# Genera el hash BCrypt (costo 12) de la clave del admin SIN mostrarla ni dejarla en el historial.
# Uso:  $hash = .\database\setup\new-admin-hash.ps1      (la clave se pide dos veces, oculta)
# Requiere JDK 21 en PATH/JAVA_HOME y haber compilado el backend alguna vez (usa los jar de ~/.m2).
$ErrorActionPreference = 'Stop'

$m2 = Join-Path $env:USERPROFILE '.m2\repository\org\springframework'
$crypto = Get-ChildItem "$m2\security\spring-security-crypto\6.4.*\*.jar" | Where-Object Name -notlike '*-sources.jar' | Sort-Object FullName | Select-Object -Last 1
$jcl = Get-ChildItem "$m2\spring-jcl\*\*.jar" | Where-Object Name -notlike '*-sources.jar' | Sort-Object FullName | Select-Object -Last 1
if (-not $crypto -or -not $jcl) { throw 'Faltan spring-security-crypto o spring-jcl en ~/.m2: corre "mvn package" en backend/.' }

function Read-Secret($prompt) {
    $s = Read-Host $prompt -AsSecureString
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
    try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
}

$p1 = Read-Secret 'Clave del admin (min. 12 caracteres)'
$p2 = Read-Secret 'Repite la clave'
if ($p1 -ne $p2) { throw 'Las claves no coinciden.' }

$java = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin\java.exe' } else { 'java' }
$src = Join-Path $PSScriptRoot 'tools\BcryptHash.java'
[Console]::OutputEncoding = $OutputEncoding = New-Object System.Text.UTF8Encoding $false   # claves con tildes/ñ llegan intactas
$hash = $p1 | & $java -cp "$($crypto.FullName);$($jcl.FullName)" $src
$p1 = $null; $p2 = $null
if ($LASTEXITCODE -ne 0 -or -not $hash) { throw 'No se pudo generar el hash.' }
$hash
