#!/usr/bin/env node
/**
 * Script pour exécuter tous les tests du frontend E-Lib
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DÉMARRAGE DES TESTS FRONTEND E-LIB');
console.log('='.repeat(60));

// Vérifier que nous sommes dans le bon répertoire
if (!fs.existsSync('package.json')) {
    console.error('❌ ERREUR: package.json non trouvé');
    console.error('   Assurez-vous d\'être dans le répertoire Frontend/elib-frontend');
    process.exit(1);
}

// Vérifier les dépendances
console.log('📦 Vérification des dépendances...');
const requiredDeps = [
    'react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react',
    '@testing-library/react', '@testing-library/jest-dom', 'jest'
];

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);

if (missingDeps.length > 0) {
    console.error(`❌ ERREUR: Dépendances manquantes: ${missingDeps.join(', ')}`);
    console.error('   Installez-les avec: npm install');
    process.exit(1);
}
console.log('✅ Toutes les dépendances sont installées');

// Vérifier la configuration Jest
console.log('\n🔧 Vérification de la configuration Jest...');
if (!fs.existsSync('jest.config.js')) {
    console.error('❌ ERREUR: jest.config.js non trouvé');
    process.exit(1);
}
if (!fs.existsSync('src/tests/setup.js')) {
    console.error('❌ ERREUR: src/tests/setup.js non trouvé');
    process.exit(1);
}
console.log('✅ Configuration Jest trouvée');

// Vérifier les fichiers de test
console.log('\n📁 Vérification des fichiers de test...');
const testFiles = [
    'src/tests/App.test.jsx',
    'src/tests/components/Header.test.jsx',
    'src/tests/components/BookCard.test.jsx',
    'src/tests/contexts/AuthContext.test.jsx',
    'src/tests/pages/HomePage.test.jsx',
    'src/tests/integration/UserFlow.test.jsx'
];

const missingTests = testFiles.filter(file => !fs.existsSync(file));
if (missingTests.length > 0) {
    console.error(`❌ ERREUR: Fichiers de test manquants: ${missingTests.join(', ')}`);
    process.exit(1);
}
console.log('✅ Tous les fichiers de test sont présents');

// Exécuter les tests
console.log('\n🧪 Exécution des tests...');
console.log('='.repeat(50));

try {
    // Exécuter Jest avec coverage
    const command = 'npm test -- --coverage --watchAll=false --verbose';
    console.log(`📝 Commande: ${command}`);
    
    const output = execSync(command, {
        encoding: 'utf8',
        stdio: 'inherit',
        cwd: process.cwd()
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 TOUS LES TESTS FRONTEND SONT PASSÉS!');
    console.log('✅ Le frontend est prêt pour la production');
    
} catch (error) {
    console.error('\n❌ ERREUR: CERTAINS TESTS ONT ÉCHOUÉ');
    console.error('   Veuillez corriger les erreurs avant de continuer');
    console.error('\nDétails de l\'erreur:');
    console.error(error.message);
    process.exit(1);
}

// Vérifier la couverture de code
console.log('\n📊 Analyse de la couverture de code...');
if (fs.existsSync('coverage/lcov-report/index.html')) {
    console.log('✅ Rapport de couverture généré: coverage/lcov-report/index.html');
} else {
    console.log('⚠️  ATTENTION: Rapport de couverture non généré');
}

console.log('\n' + '='.repeat(60));
console.log('🎯 RÉSUMÉ DES TESTS FRONTEND');
console.log('✅ Tests unitaires: PASSÉS');
console.log('✅ Tests d\'intégration: PASSÉS');
console.log('✅ Tests de composants: PASSÉS');
console.log('✅ Tests de contextes: PASSÉS');
console.log('✅ Couverture de code: GÉNÉRÉE');
console.log('\n🚀 Le frontend E-Lib est prêt!');