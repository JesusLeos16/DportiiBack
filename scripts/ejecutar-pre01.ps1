$ErrorActionPreference = "Stop"

if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
  throw "k6 no está instalado o no está disponible en PATH"
}

function Convert-SecureValueToPlainText {
  param([Security.SecureString]$SecureValue)

  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
}

$emailSecure = Read-Host "Correo de la cuenta controlada" -AsSecureString
$passwordSecure = Read-Host "Contraseña de la cuenta controlada" -AsSecureString
$email = Convert-SecureValueToPlainText $emailSecure
$password = Convert-SecureValueToPlainText $passwordSecure
$apiUrl = "http://127.0.0.1:3315"
$exitCode = 1

try {
  $loginBody = @{ email = $email; password = $password } | ConvertTo-Json -Compress
  $login = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method Post `
    -ContentType "application/json" -Body $loginBody

  if ([string]::IsNullOrWhiteSpace($login.token)) {
    throw "El login controlado no devolvió un token"
  }

  $env:DPORTII_API_URL = $apiUrl
  $env:DPORTII_TEST_TOKEN = $login.token

  & k6 run (Join-Path $PSScriptRoot "..\tests\pre01-torneo.js")
  $exitCode = $LASTEXITCODE
}
finally {
  Remove-Item Env:DPORTII_API_URL -ErrorAction SilentlyContinue
  Remove-Item Env:DPORTII_TEST_TOKEN -ErrorAction SilentlyContinue
  $login = $null
  $loginBody = $null
  $email = $null
  $password = $null
}

exit $exitCode
