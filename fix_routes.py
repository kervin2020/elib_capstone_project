#!/usr/bin/env python3
"""
Script pour corriger tous les fichiers de routes
"""
import os
import re

def fix_route_file(file_path):
    """Corrige le formatage d'un fichier de route"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Restaurer les sauts de ligne après les décorateurs et fonctions
        content = re.sub(r'@(\w+)\.route\(', r'\n@\1.route(', content)
        content = re.sub(r'@jwt_required\(\)', r'\n@jwt_required()', content)
        content = re.sub(r'def (\w+)\(', r'\ndef \1(', content)
        content = re.sub(r'if ', r'\nif ', content)
        content = re.sub(r'else:', r'\nelse:', content)
        content = re.sub(r'return ', r'\nreturn ', content)
        content = re.sub(r'from ', r'\nfrom ', content)
        content = re.sub(r'import ', r'\nimport ', content)
        content = re.sub(r'# ', r'\n# ', content)
        
        # Nettoyer les sauts de ligne multiples
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        content = re.sub(r'^\s*\n', '', content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Route corrigée: {file_path}")
        return True
    except Exception as e:
        print(f"Erreur avec {file_path}: {e}")
        return False

def main():
    """Fonction principale"""
    route_files = [
        'Backend/Elib/Elib/routes/routes_ebook.py',
        'Backend/Elib/Elib/routes/route_category.py',
        'Backend/Elib/Elib/routes/route_loan.py'
    ]
    
    for file_path in route_files:
        if os.path.exists(file_path):
            fix_route_file(file_path)
        else:
            print(f"Fichier non trouvé: {file_path}")

if __name__ == '__main__':
    main()
