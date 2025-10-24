#!/usr/bin/env python3
"""
Script pour formater automatiquement tous les fichiers Python selon PEP 8
"""
import os
import re
import ast
import subprocess
import sys

def format_python_file(file_path):
    """Formate un fichier Python selon PEP 8"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier si le fichier est valide Python
        try:
            ast.parse(content)
        except SyntaxError as e:
            print(f"Erreur de syntaxe dans {file_path}: {e}")
            return False
        
        # Appliquer les corrections de formatage de base
        formatted_content = content
        
        # 1. Corriger les imports
        formatted_content = fix_imports(formatted_content)
        
        # 2. Corriger l'espacement
        formatted_content = fix_spacing(formatted_content)
        
        # 3. Corriger les lignes trop longues
        formatted_content = fix_long_lines(formatted_content)
        
        # 4. Corriger l'indentation
        formatted_content = fix_indentation(formatted_content)
        
        # Écrire le fichier formaté
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(formatted_content)
        
        print(f"Fichier formaté: {file_path}")
        return True
        
    except Exception as e:
        print(f"Erreur avec {file_path}: {e}")
        return False

def fix_imports(content):
    """Corrige les imports"""
    lines = content.split('\n')
    import_lines = []
    other_lines = []
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith(('import ', 'from ')):
            import_lines.append(line)
        else:
            other_lines.append(line)
    
    # Trier les imports
    import_lines.sort()
    
    # Reconstituer le contenu
    result = []
    if import_lines:
        result.extend(import_lines)
        result.append('')  # Ligne vide après les imports
    result.extend(other_lines)
    
    return '\n'.join(result)

def fix_spacing(content):
    """Corrige l'espacement"""
    # Ajouter des espaces autour des opérateurs
    content = re.sub(r'(\w)([+\-*/=<>!]+)(\w)', r'\1 \2 \3', content)
    
    # Ajouter des espaces après les virgules
    content = re.sub(r',([^\s])', r', \1', content)
    
    # Ajouter des espaces après les deux-points
    content = re.sub(r':([^\s])', r': \1', content)
    
    # Corriger les espaces autour des parenthèses
    content = re.sub(r'(\w)\(', r'\1(', content)
    content = re.sub(r'\)(\w)', r') \1', content)
    
    return content

def fix_long_lines(content):
    """Corrige les lignes trop longues"""
    lines = content.split('\n')
    result = []
    
    for line in lines:
        if len(line) > 88:  # Limite PEP 8
            # Essayer de couper la ligne
            if '=' in line and len(line.split('=')[0]) < 40:
                # Couper après un signe égal
                parts = line.split('=', 1)
                result.append(parts[0] + '=')
                result.append('    ' + parts[1].strip())
            else:
                result.append(line)
        else:
            result.append(line)
    
    return '\n'.join(result)

def fix_indentation(content):
    """Corrige l'indentation"""
    lines = content.split('\n')
    result = []
    indent_level = 0
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            result.append('')
            continue
        
        # Déterminer le niveau d'indentation approprié
        if stripped.startswith(('class ', 'def ', 'if ', 'for ', 'while ', 'try:', 'except', 'finally:', 'with ')):
            # Nouveau bloc
            result.append('    ' * indent_level + stripped)
            if stripped.endswith(':'):
                indent_level += 1
        elif stripped.startswith(('return ', 'break', 'continue', 'pass')):
            # Fin de bloc
            result.append('    ' * indent_level + stripped)
        elif stripped.startswith(('else:', 'elif ', 'except', 'finally:')):
            # Même niveau que le bloc précédent
            indent_level = max(0, indent_level - 1)
            result.append('    ' * indent_level + stripped)
            if stripped.endswith(':'):
                indent_level += 1
        else:
            # Ligne normale
            result.append('    ' * indent_level + stripped)
    
    return '\n'.join(result)

def main():
    """Fonction principale"""
    print("Formatage des fichiers Python selon PEP 8...")
    
    # Fichiers Python à formater
    python_files = [
        'Backend/Elib/Elib/app.py',
        'Backend/Elib/Elib/config.py',
        'Backend/Elib/Elib/models.py',
        'Backend/Elib/Elib/init_db.py',
        'Backend/Elib/Elib/run_tests.py',
        'Backend/Elib/Elib/test_backend.py',
        'Backend/Elib/Elib/test_structure.py',
        'Backend/Elib/Elib/routes/route_user.py',
        'Backend/Elib/Elib/routes/routes_ebook.py',
        'Backend/Elib/Elib/routes/route_category.py',
        'Backend/Elib/Elib/routes/route_loan.py',
        'Backend/Elib/Elib/utils/check_expired_loans.py',
        'Backend/Elib/Elib/utils/email_service.py'
    ]
    
    formatted_count = 0
    
    for file_path in python_files:
        if os.path.exists(file_path):
            if format_python_file(file_path):
                formatted_count += 1
        else:
            print(f"Fichier non trouvé: {file_path}")
    
    print(f"\nRésumé:")
    print(f"Fichiers formatés: {formatted_count}/{len(python_files)}")

if __name__ == '__main__':
    main()
