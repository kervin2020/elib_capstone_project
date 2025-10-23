#!/usr/bin/env node
/**
 * Script de vérification de la structure et de la logique du frontend E-Lib
 */

const fs = require('fs');
const path = require('path');

function checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: ${filePath}`);
        return true;
    } else {
        console.log(`❌ ${description}: ${filePath} - MANQUANT`);
        return false;
    }
}

function checkComponentStructure() {
    console.log('\n🧩 Vérification de la structure des composants...');
    
    const componentFiles = [
        'src/components/common/Header.jsx',
        'src/components/common/Footer.jsx',
        'src/components/common/BookCard.jsx',
        'src/components/common/Modal.jsx',
        'src/components/common/Toast.jsx',
        'src/components/common/LoadingSpinner.jsx',
        'src/components/auth/LoginForm.jsx',
        'src/components/auth/RegisterForm.jsx',
        'src/components/books/BookDetailModal.jsx',
        'src/components/books/AddBookModal.jsx'
    ];
    
    let componentsOk = 0;
    for (const file of componentFiles) {
        if (checkFileExists(file, 'Composant')) {
            componentsOk++;
        }
    }
    
    return componentsOk >= componentFiles.length * 0.8; // 80% des composants
}

function checkContextStructure() {
    console.log('\n🔄 Vérification des contextes...');
    
    const contextFiles = [
        'src/contexts/AuthContext.jsx',
        'src/contexts/BookContext.jsx',
        'src/contexts/LoanContext.jsx',
        'src/contexts/AdminContext.jsx',
        'src/contexts/ToastContext.jsx'
    ];
    
    let contextsOk = 0;
    for (const file of contextFiles) {
        if (checkFileExists(file, 'Contexte')) {
            contextsOk++;
        }
    }
    
    return contextsOk >= contextFiles.length * 0.8; // 80% des contextes
}

function checkPageStructure() {
    console.log('\n📄 Vérification des pages...');
    
    const pageFiles = [
        'src/pages/HomePage.jsx',
        'src/pages/BooksPage.jsx',
        'src/pages/LoansPage.jsx',
        'src/pages/AdminPage.jsx'
    ];
    
    let pagesOk = 0;
    for (const file of pageFiles) {
        if (checkFileExists(file, 'Page')) {
            pagesOk++;
        }
    }
    
    return pagesOk >= pageFiles.length * 0.8; // 80% des pages
}

function checkRouting() {
    console.log('\n🛣️  Vérification du routage...');
    
    if (!checkFileExists('src/App.jsx', 'App principal')) {
        return false;
    }
    
    try {
        const appContent = fs.readFileSync('src/App.jsx', 'utf8');
        
        const routingFeatures = [];
        
        // Vérifier React Router
        if (appContent.includes('react-router-dom')) {
            routingFeatures.push('React Router');
            console.log('  ✅ React Router importé');
        } else {
            console.log('  ❌ React Router manquant');
        }
        
        // Vérifier les routes
        if (appContent.includes('Routes') && appContent.includes('Route')) {
            routingFeatures.push('Route Components');
            console.log('  ✅ Composants de route présents');
        } else {
            console.log('  ❌ Composants de route manquants');
        }
        
        // Vérifier la navigation
        if (appContent.includes('Navigate')) {
            routingFeatures.push('Navigation');
            console.log('  ✅ Navigation présente');
        } else {
            console.log('  ❌ Navigation manquante');
        }
        
        // Vérifier les routes protégées
        if (appContent.includes('ProtectedRoute')) {
            routingFeatures.push('Protected Routes');
            console.log('  ✅ Routes protégées présentes');
        } else {
            console.log('  ❌ Routes protégées manquantes');
        }
        
        return routingFeatures.length >= 3;
        
    } catch (error) {
        console.log(`  ❌ Erreur lors de l'analyse: ${error.message}`);
        return false;
    }
}

function checkStateManagement() {
    console.log('\n🔄 Vérification de la gestion d\'état...');
    
    try {
        const authContext = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');
        const bookContext = fs.readFileSync('src/contexts/BookContext.jsx', 'utf8');
        
        const stateFeatures = [];
        
        // Vérifier useReducer
        if (authContext.includes('useReducer')) {
            stateFeatures.push('useReducer');
            console.log('  ✅ useReducer utilisé');
        } else {
            console.log('  ❌ useReducer manquant');
        }
        
        // Vérifier useContext
        if (authContext.includes('useContext')) {
            stateFeatures.push('useContext');
            console.log('  ✅ useContext utilisé');
        } else {
            console.log('  ❌ useContext manquant');
        }
        
        // Vérifier les actions
        if (authContext.includes('ACTIONS') || authContext.includes('Actions')) {
            stateFeatures.push('Actions');
            console.log('  ✅ Actions définies');
        } else {
            console.log('  ❌ Actions manquantes');
        }
        
        // Vérifier les providers
        if (authContext.includes('Provider')) {
            stateFeatures.push('Providers');
            console.log('  ✅ Providers présents');
        } else {
            console.log('  ❌ Providers manquants');
        }
        
        return stateFeatures.length >= 3;
        
    } catch (error) {
        console.log(`  ❌ Erreur lors de l'analyse: ${error.message}`);
        return false;
    }
}

function checkAPIIntegration() {
    console.log('\n🌐 Vérification de l\'intégration API...');
    
    try {
        const authContext = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');
        const bookContext = fs.readFileSync('src/contexts/BookContext.jsx', 'utf8');
        
        const apiFeatures = [];
        
        // Vérifier Axios
        if (authContext.includes('axios') || bookContext.includes('axios')) {
            apiFeatures.push('Axios');
            console.log('  ✅ Axios utilisé');
        } else {
            console.log('  ❌ Axios manquant');
        }
        
        // Vérifier les appels API
        if (authContext.includes('axios.get') || authContext.includes('axios.post')) {
            apiFeatures.push('API Calls');
            console.log('  ✅ Appels API présents');
        } else {
            console.log('  ❌ Appels API manquants');
        }
        
        // Vérifier la gestion des erreurs
        if (authContext.includes('catch') || bookContext.includes('catch')) {
            apiFeatures.push('Error Handling');
            console.log('  ✅ Gestion des erreurs présente');
        } else {
            console.log('  ❌ Gestion des erreurs manquante');
        }
        
        // Vérifier les intercepteurs
        if (authContext.includes('interceptors')) {
            apiFeatures.push('Interceptors');
            console.log('  ✅ Intercepteurs présents');
        } else {
            console.log('  ❌ Intercepteurs manquants');
        }
        
        return apiFeatures.length >= 3;
        
    } catch (error) {
        console.log(`  ❌ Erreur lors de l'analyse: ${error.message}`);
        return false;
    }
}

function checkStyling() {
    console.log('\n🎨 Vérification du styling...');
    
    const stylingFiles = [
        'tailwind.config.js',
        'postcss.config.js',
        'src/index.css',
        'src/App.css'
    ];
    
    let stylingOk = 0;
    for (const file of stylingFiles) {
        if (checkFileExists(file, 'Fichier de style')) {
            stylingOk++;
        }
    }
    
    // Vérifier Tailwind CSS
    try {
        const indexCss = fs.readFileSync('src/index.css', 'utf8');
        if (indexCss.includes('@tailwind')) {
            console.log('  ✅ Tailwind CSS configuré');
            stylingOk++;
        } else {
            console.log('  ❌ Tailwind CSS non configuré');
        }
    } catch (error) {
        console.log('  ❌ Erreur lors de la vérification de Tailwind');
    }
    
    return stylingOk >= 3;
}

function checkTesting() {
    console.log('\n🧪 Vérification des tests...');
    
    const testFiles = [
        'jest.config.js',
        'src/tests/setup.js',
        'src/tests/App.test.jsx',
        'src/tests/components/Header.test.jsx',
        'src/tests/components/BookCard.test.jsx',
        'src/tests/contexts/AuthContext.test.jsx',
        'src/tests/pages/HomePage.test.jsx',
        'src/tests/integration/UserFlow.test.jsx'
    ];
    
    let testsOk = 0;
    for (const file of testFiles) {
        if (checkFileExists(file, 'Fichier de test')) {
            testsOk++;
        }
    }
    
    return testsOk >= testFiles.length * 0.8; // 80% des tests
}

function checkPackageJson() {
    console.log('\n📦 Vérification du package.json...');
    
    if (!checkFileExists('package.json', 'package.json')) {
        return false;
    }
    
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        const requiredDeps = [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'lucide-react',
            'recharts'
        ];
        
        const requiredDevDeps = [
            'tailwindcss',
            '@testing-library/react',
            '@testing-library/jest-dom',
            'jest'
        ];
        
        let depsOk = 0;
        for (const dep of requiredDeps) {
            if (packageJson.dependencies && packageJson.dependencies[dep]) {
                console.log(`  ✅ ${dep} présent`);
                depsOk++;
            } else {
                console.log(`  ❌ ${dep} manquant`);
            }
        }
        
        let devDepsOk = 0;
        for (const dep of requiredDevDeps) {
            if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
                console.log(`  ✅ ${dep} présent (dev)`);
                devDepsOk++;
            } else {
                console.log(`  ❌ ${dep} manquant (dev)`);
            }
        }
        
        return depsOk >= requiredDeps.length * 0.8 && devDepsOk >= requiredDevDeps.length * 0.8;
        
    } catch (error) {
        console.log(`  ❌ Erreur lors de l'analyse du package.json: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('🚀 VÉRIFICATION DE LA STRUCTURE FRONTEND E-LIB');
    console.log('=' .repeat(60));
    
    // Vérifier les fichiers principaux
    console.log('\n📁 Vérification des fichiers principaux...');
    
    const mainFiles = [
        'src/App.jsx',
        'src/main.jsx',
        'src/index.css',
        'src/App.css',
        'package.json',
        'vite.config.js',
        'tailwind.config.js'
    ];
    
    let mainFilesOk = 0;
    for (const file of mainFiles) {
        if (checkFileExists(file, 'Fichier principal')) {
            mainFilesOk++;
        }
    }
    
    // Vérifier les composants
    const componentsOk = checkComponentStructure();
    
    // Vérifier les contextes
    const contextsOk = checkContextStructure();
    
    // Vérifier les pages
    const pagesOk = checkPageStructure();
    
    // Vérifier le routage
    const routingOk = checkRouting();
    
    // Vérifier la gestion d'état
    const stateOk = checkStateManagement();
    
    // Vérifier l'intégration API
    const apiOk = checkAPIIntegration();
    
    // Vérifier le styling
    const stylingOk = checkStyling();
    
    // Vérifier les tests
    const testsOk = checkTesting();
    
    // Vérifier le package.json
    const packageOk = checkPackageJson();
    
    // Résumé
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RÉSUMÉ DE LA VÉRIFICATION');
    console.log('=' .repeat(60));
    
    console.log(`📁 Fichiers principaux: ${mainFilesOk}/${mainFiles.length}`);
    console.log(`🧩 Composants: ${componentsOk ? '✅' : '❌'}`);
    console.log(`🔄 Contextes: ${contextsOk ? '✅' : '❌'}`);
    console.log(`📄 Pages: ${pagesOk ? '✅' : '❌'}`);
    console.log(`🛣️  Routage: ${routingOk ? '✅' : '❌'}`);
    console.log(`🔄 Gestion d'état: ${stateOk ? '✅' : '❌'}`);
    console.log(`🌐 Intégration API: ${apiOk ? '✅' : '❌'}`);
    console.log(`🎨 Styling: ${stylingOk ? '✅' : '❌'}`);
    console.log(`🧪 Tests: ${testsOk ? '✅' : '❌'}`);
    console.log(`📦 Package.json: ${packageOk ? '✅' : '❌'}`);
    
    // Score total
    const checks = [
        mainFilesOk >= mainFiles.length * 0.8,
        componentsOk,
        contextsOk,
        pagesOk,
        routingOk,
        stateOk,
        apiOk,
        stylingOk,
        testsOk,
        packageOk
    ];
    
    const totalScore = checks.filter(Boolean).length;
    
    console.log(`\n🎯 Score total: ${totalScore}/10`);
    
    if (totalScore >= 8) {
        console.log('🎉 EXCELLENT! Le frontend est bien structuré');
        return true;
    } else if (totalScore >= 6) {
        console.log('✅ BON! Le frontend est fonctionnel avec quelques améliorations possibles');
        return true;
    } else {
        console.log('❌ ATTENTION! Le frontend nécessite des améliorations');
        return false;
    }
}

if (require.main === module) {
    const success = main();
    process.exit(success ? 0 : 1);
}

module.exports = { main };
