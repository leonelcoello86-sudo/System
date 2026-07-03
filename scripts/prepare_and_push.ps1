<#
PowerShell helper para crear rama, commitear y pushear con mensajes convencionales.
Uso: PowerShell -ExecutionPolicy Bypass -File .\scripts\prepare_and_push.ps1
El script preguntará confirmación antes de cada commit.
#>

param(
    [string]$DefaultBranch = "feat/backend-tests-docs"
)

function Run-Git {
    param($Args)
    Write-Host "git $Args"
    & git $Args
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: comando git devolvió código $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

# Comprueba que estamos en un repo git
if (-not (Test-Path ".git")) {
    Write-Host "No se encontró un repositorio Git en el directorio actual." -ForegroundColor Red
    Write-Host "Ejecuta este script desde la raíz del repositorio." -ForegroundColor Yellow
    exit 1
}

$branch = Read-Host "Nombre de la rama (Enter para usar '$DefaultBranch')"
if ([string]::IsNullOrWhiteSpace($branch)) { $branch = $DefaultBranch }

Write-Host "Usando rama: $branch"

# Crear o cambiar a la rama
# Si la rama ya existe, hacer checkout, si no, crearla
$branches = & git branch --list $branch
if ($branches -match $branch) {
    Run-Git "checkout $branch"
} else {
    Run-Git "checkout -b $branch"
}

Write-Host "Estado actual (git status):" -ForegroundColor Cyan
& git status

$confirm = Read-Host "Continuar y añadir archivos listados al staging? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') { Write-Host "Cancelado por usuario."; exit 0 }

$filesToAdd = @(
    'backend/src/services/assetService.js',
    'backend/src/utils/logger.js',
    'backend/tests',
    'backend/vitest.config.js',
    'backend/jsdoc.json',
    'backend/docs',
    'README.md',
    '.github/workflows/ci.yml',
    'backend/package.json',
    '.github/PULL_REQUEST_TEMPLATE.md',
    'commit-messages.txt',
    'backend/.eslintrc.json'
)

# Añadir archivos
Write-Host "git add ..." -ForegroundColor Cyan
Run-Git "add --all $($filesToAdd -join ' ')"

# Leer mensajes de commit desde commit-messages.txt si existe
$commitMessages = @()
if (Test-Path "commit-messages.txt") {
    $commitMessages = Get-Content "commit-messages.txt" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
} else {
    $commitMessages = @(
        'feat(backend): asset service, validation and save logic (Tarea #2)',
        'test(backend): add unit tests for asset service (Tarea #4)',
        'chore(ci): add GitHub Actions workflow for backend tests (Tarea #5)',
        'docs(backend): add jsdoc config and generate docs (Tarea #6, Tarea #7)',
        'docs: update README with exact commands for tests and docs (Tarea #8)'
    )
}

foreach ($msg in $commitMessages) {
    $do = Read-Host "Hacer commit con mensaje: '$msg'? (y/n)"
    if ($do -eq 'y' -or $do -eq 'Y') {
        Run-Git "commit -m \"$msg\""
    } else {
        Write-Host "Omitido: $msg" -ForegroundColor Yellow
    }
}

# Push final
$pushConfirm = Read-Host "Push de la rama '$branch' a origin? (y/n)"
if ($pushConfirm -eq 'y' -or $pushConfirm -eq 'Y') {
    Run-Git "push origin $branch"
    Write-Host "Push completado. Crea el PR en GitHub desde la rama $branch." -ForegroundColor Green
} else {
    Write-Host "No se realizó push. Puedes revisar commits localmente y luego hacer push manualmente." -ForegroundColor Yellow
}
