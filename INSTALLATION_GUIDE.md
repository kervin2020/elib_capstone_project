# Guide d'Installation E-Lib - Système Complet

## 🚀 Installation des Prérequis

### 1. Installation de Python

#### Option A: Installation via Microsoft Store (Recommandée)
1. Ouvrez le Microsoft Store
2. Recherchez "Python 3.11" ou "Python 3.12"
3. Installez la version la plus récente
4. Redémarrez votre terminal

#### Option B: Installation via python.org
1. Allez sur https://www.python.org/downloads/
2. Téléchargez Python 3.11 ou 3.12
3. **IMPORTANT**: Cochez "Add Python to PATH" pendant l'installation
4. Redémarrez votre terminal

### 2. Installation de Node.js

#### Option A: Installation via nodejs.org (Recommandée)
1. Allez sur https://nodejs.org/
2. Téléchargez la version LTS (Long Term Support)
3. Installez avec les options par défaut
4. Redémarrez votre terminal

#### Option B: Installation via Chocolatey
```powershell
# Installer Chocolatey d'abord
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Installer Node.js
choco install nodejs
```

### 3. Installation de pipenv

Après avoir installé Python:
```bash
pip install pipenv
```

### 4. Installation de Git (si pas déjà installé)

```powershell
# Via Chocolatey
choco install git

# Ou télécharger depuis https://git-scm.com/
```

## 🔧 Configuration du Projet

### 1. Backend (Flask)

```bash
# Aller dans le répertoire backend
cd Backend/Elib/Elib

# Créer un environnement virtuel avec pipenv
pipenv install

# Installer les dépendances
pipenv install flask flask-sqlalchemy flask-jwt-extended flask-cors flask-bcrypt flask-migrate email-validator

# Activer l'environnement virtuel
pipenv shell

# Initialiser la base de données
python -c "from app import create_app; app = create_app(); print('Backend configuré!')"
```

### 2. Frontend (React)

```bash
# Aller dans le répertoire frontend
cd Frontend/elib-frontend

# Installer les dépendances
npm install

# Installer les dépendances de développement
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom babel-jest identity-obj-proxy

# Vérifier l'installation
npm run build
```

## 🧪 Exécution des Tests

### Tests Backend
```bash
cd Backend/Elib/Elib
pipenv shell
python test_structure.py
```

### Tests Frontend
```bash
cd Frontend/elib-frontend
npm test
```

### Tests Complets
```bash
# Depuis la racine du projet
python run_all_tests.py
```

## 🚀 Démarrage du Système

### 1. Démarrer le Backend
```bash
cd Backend/Elib/Elib
pipenv shell
python app.py
```
Le backend sera accessible sur http://localhost:5000

### 2. Démarrer le Frontend
```bash
cd Frontend/elib-frontend
npm run dev
```
Le frontend sera accessible sur http://localhost:5173

## 🔍 Vérification de l'Installation

### Vérifier Python
```bash
python --version
pip --version
pipenv --version
```

### Vérifier Node.js
```bash
node --version
npm --version
```

### Vérifier Git
```bash
git --version
```

## 🛠️ Résolution des Problèmes

### Problème: "python not found"
- Vérifiez que Python est dans le PATH
- Redémarrez votre terminal
- Essayez `python3` au lieu de `python`

### Problème: "node not found"
- Vérifiez que Node.js est dans le PATH
- Redémarrez votre terminal
- Réinstallez Node.js si nécessaire

### Problème: "pipenv not found"
```bash
pip install pipenv
# Ou
python -m pip install pipenv
```

### Problème: "npm not found"
- Réinstallez Node.js
- Vérifiez que npm est inclus dans l'installation

## 📋 Checklist d'Installation

- [ ] Python 3.11+ installé
- [ ] Node.js LTS installé
- [ ] pipenv installé
- [ ] Git installé
- [ ] Backend configuré et testé
- [ ] Frontend configuré et testé
- [ ] Tests passent
- [ ] Système fonctionne

## 🎯 Prochaines Étapes

1. **Installer les prérequis** selon ce guide
2. **Configurer le projet** avec les commandes ci-dessus
3. **Exécuter les tests** pour vérifier que tout fonctionne
4. **Démarrer le système** et commencer à développer

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez que tous les prérequis sont installés
2. Redémarrez votre terminal
3. Vérifiez les chemins d'installation
4. Consultez les logs d'erreur
