# Script d'installation automatique pour E-Lib
# Exécuter en tant qu'administrateur

Write-Host "🚀 Installation des dépendances E-Lib" -ForegroundColor Green
Write-Host "=" * 50

# Vérifier si on est administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Ce script nécessite des privilèges administrateur" -ForegroundColor Yellow
    Write-Host "💡 Relancez PowerShell en tant qu'administrateur" -ForegroundColor Yellow
    exit 1
}

# Fonction pour installer Chocolatey
function Install-Chocolatey {
    Write-Host "📦 Installation de Chocolatey..." -ForegroundColor Blue
    try {
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "✅ Chocolatey installé avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'installation de Chocolatey: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour installer Python
function Install-Python {
    Write-Host "🐍 Installation de Python..." -ForegroundColor Blue
    try {
        choco install python --version=3.11.0 -y
        Write-Host "✅ Python installé avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'installation de Python: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour installer Node.js
function Install-NodeJS {
    Write-Host "📦 Installation de Node.js..." -ForegroundColor Blue
    try {
        choco install nodejs -y
        Write-Host "✅ Node.js installé avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'installation de Node.js: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour installer Git
function Install-Git {
    Write-Host "🔧 Installation de Git..." -ForegroundColor Blue
    try {
        choco install git -y
        Write-Host "✅ Git installé avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'installation de Git: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour installer pipenv
function Install-Pipenv {
    Write-Host "📦 Installation de pipenv..." -ForegroundColor Blue
    try {
        python -m pip install --upgrade pip
        python -m pip install pipenv
        Write-Host "✅ pipenv installé avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'installation de pipenv: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour configurer le backend
function Setup-Backend {
    Write-Host "🔧 Configuration du backend..." -ForegroundColor Blue
    try {
        Set-Location "Backend\Elib\Elib"
        
        # Créer l'environnement virtuel
        pipenv install
        
        # Installer les dépendances
        pipenv install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-bcrypt flask-migrate email-validator
        
        Write-Host "✅ Backend configuré avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de la configuration du backend: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Set-Location "..\..\.."
    }
}

# Fonction pour configurer le frontend
function Setup-Frontend {
    Write-Host "🔧 Configuration du frontend..." -ForegroundColor Blue
    try {
        Set-Location "Frontend\elib-frontend"
        
        # Installer les dépendances
        npm install
        
        # Installer les dépendances de développement
        npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom babel-jest identity-obj-proxy
        
        Write-Host "✅ Frontend configuré avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de la configuration du frontend: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Set-Location "..\.."
    }
}

# Fonction pour exécuter les tests
function Run-Tests {
    Write-Host "🧪 Exécution des tests..." -ForegroundColor Blue
    try {
        # Test backend
        Set-Location "Backend\Elib\Elib"
        python test_structure.py
        Set-Location "..\..\.."
        
        # Test frontend
        Set-Location "Frontend\elib-frontend"
        node test_structure.js
        Set-Location "..\.."
        
        Write-Host "✅ Tests exécutés avec succès" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Erreur lors de l'exécution des tests: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction principale
function Main {
    $results = @{}
    
    # Installation de Chocolatey
    $results.Chocolatey = Install-Chocolatey
    
    if (-not $results.Chocolatey) {
        Write-Host "❌ Impossible de continuer sans Chocolatey" -ForegroundColor Red
        exit 1
    }
    
    # Installation de Python
    $results.Python = Install-Python
    
    # Installation de Node.js
    $results.NodeJS = Install-NodeJS
    
    # Installation de Git
    $results.Git = Install-Git
    
    # Attendre que les installations se terminent
    Write-Host "⏳ Attente de la fin des installations..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Installation de pipenv
    $results.Pipenv = Install-Pipenv
    
    # Configuration du backend
    $results.Backend = Setup-Backend
    
    # Configuration du frontend
    $results.Frontend = Setup-Frontend
    
    # Exécution des tests
    $results.Tests = Run-Tests
    
    # Résumé
    Write-Host "`n📊 RÉSUMÉ DE L'INSTALLATION" -ForegroundColor Green
    Write-Host "=" * 50
    
    foreach ($key in $results.Keys) {
        $status = if ($results[$key]) { "✅" } else { "❌" }
        Write-Host "$status $key" -ForegroundColor $(if ($results[$key]) { "Green" } else { "Red" })
    }
    
    $successCount = ($results.Values | Where-Object { $_ }).Count
    $totalCount = $results.Count
    
    Write-Host "`n🎯 Score: $successCount/$totalCount" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
    
    if ($successCount -eq $totalCount) {
        Write-Host "🎉 Installation complète réussie!" -ForegroundColor Green
        Write-Host "🚀 Vous pouvez maintenant démarrer le système E-Lib" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Installation partiellement réussie" -ForegroundColor Yellow
        Write-Host "🔧 Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    }
}

# Exécution du script principal
Main
