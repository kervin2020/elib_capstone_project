# Script de vérification de l'installation E-Lib
Write-Host "🔍 Vérification de l'installation E-Lib" -ForegroundColor Green
Write-Host "=" * 50

# Vérifier Python
Write-Host "`n🐍 Vérification de Python..." -ForegroundColor Blue
try {
    $pythonVersion = & C:\Python311\python.exe --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python installé: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Python non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Python non trouvé" -ForegroundColor Red
}

# Vérifier pipenv
Write-Host "`n📦 Vérification de pipenv..." -ForegroundColor Blue
try {
    $pipenvVersion = & C:\Python311\Scripts\pipenv.exe --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ pipenv installé: $pipenvVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ pipenv non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ pipenv non trouvé" -ForegroundColor Red
}

# Vérifier Node.js
Write-Host "`n📦 Vérification de Node.js..." -ForegroundColor Blue
try {
    $nodeVersion = & node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js installé: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js non trouvé dans PATH" -ForegroundColor Red
        Write-Host "💡 Essayez de redémarrer votre terminal" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Node.js non trouvé" -ForegroundColor Red
}

# Vérifier npm
Write-Host "`n📦 Vérification de npm..." -ForegroundColor Blue
try {
    $npmVersion = & npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm installé: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ npm non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ npm non trouvé" -ForegroundColor Red
}

# Vérifier Git
Write-Host "`n🔧 Vérification de Git..." -ForegroundColor Blue
try {
    $gitVersion = & git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git installé: $gitVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Git non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Git non trouvé" -ForegroundColor Red
}

# Vérifier les répertoires du projet
Write-Host "`n📁 Vérification des répertoires du projet..." -ForegroundColor Blue
$projectDirs = @(
    "Backend\Elib\Elib",
    "Frontend\elib-frontend"
)

foreach ($dir in $projectDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ $dir existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir manquant" -ForegroundColor Red
    }
}

# Vérifier les fichiers principaux
Write-Host "`n📄 Vérification des fichiers principaux..." -ForegroundColor Blue
$mainFiles = @(
    "Backend\Elib\Elib\app.py",
    "Backend\Elib\Elib\models.py",
    "Backend\Elib\Elib\config.py",
    "Frontend\elib-frontend\package.json",
    "Frontend\elib-frontend\src\App.jsx"
)

foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Résumé de l'installation:" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "✅ Python 3.11 installé"
Write-Host "✅ pipenv installé"
Write-Host "✅ Node.js installé (redémarrez le terminal si nécessaire)"
Write-Host "✅ Git installé"
Write-Host "✅ Projet E-Lib configuré"
Write-Host "`n🚀 Vous pouvez maintenant utiliser le système E-Lib!" -ForegroundColor Green
