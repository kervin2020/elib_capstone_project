#!/usr/bin/env python3 """ Script de vérification de la structure et de la logique du backend E-Lib """ 
import os 
import sys 
import ast 
import re 
from pathlib 
import Path 
def check_file_exists(file_path, description):
 """Vérifier qu'un fichier existe""" if os.path.exists(file_path):
 print(f"OK {description}:
 {file_path}") return True else:
 print(f"MANQUANT {description}:
 {file_path}") return False 
def check_imports(file_path):
 """Vérifier les imports dans un fichier Python""" try:
 with open(file_path, 'r', encoding='utf-8') as f:
 content = f.read() tree = ast.parse(content) imports = [] for node in ast.walk(tree):
 if isinstance(node, ast.Import):
 for alias in node.names:
 imports.append(alias.name) elif isinstance(node, ast.ImportFrom):
 if node.module:
 imports.append(node.module) return imports except Exception as e:
 print(f"Erreur lors de l'analyse de {file_path}:
 {e}") return [] 
def check_route_definitions(file_path):
 """Vérifier les définitions de routes dans un fichier""" try:
 with open(file_path, 'r', encoding='utf-8') as f:
 content = f.read() 
# Rechercher les décorateurs de route route_pattern = r'
@\w+\.route\([\'"]([^\'"]+)[\'"]' routes = re.findall(route_pattern, content) return routes except Exception as e:
 print(f"Erreur lors de l'analyse des routes dans {file_path}:
 {e}") return [] 
def check_model_definitions(file_path):
 """Vérifier les définitions de modèles""" try:
 with open(file_path, 'r', encoding='utf-8') as f:
 content = f.read() 
# Rechercher les classes de modèles class_pattern = r'class\s+(\w+)\(.*Model.*\):
' models = re.findall(class_pattern, content) return models except Exception as e:
 print(f"Erreur lors de l'analyse des modeles dans {file_path}:
 {e}") return [] 
def check_api_endpoints():
 """Vérifier tous les endpoints API""" print("\nVerification des endpoints API...") route_files = [ 'routes/route_user.py', 'routes/routes_ebook.py', 'routes/route_category.py', 'routes/route_loan.py' ] all_routes = [] for file_path in route_files:
 if os.path.exists(file_path):
 routes = check_route_definitions(file_path) all_routes.extend(routes) print(f" {file_path}:
 {len(routes)} routes") for route in routes:
 print(f" - {route}") else:
 print(f" MANQUANT {file_path}") return all_routes 
def check_models():
 """Vérifier les modèles de données""" print("\nVerification des modeles de donnees...") if os.path.exists('models.py'):
 models = check_model_definitions('models.py') print(f" Modeles trouves:
 {len(models)}") for model in models:
 print(f" - {model}") return models else:
 print(" models.py - MANQUANT") return [] 
def check_database_relationships():
 """Vérifier les relations de base de données""" print("\nVerification des relations de base de donnees...") if not os.path.exists('models.py'):
 print(" models.py non trouve") return False try:
 with open('models.py', 'r', encoding='utf-8') as f:
 content = f.read() 
# Vérifier les relations relationships = [] 
# Many-to-many relationship if 'ebook_category' in content:
 relationships.append("Many-to-many:
 ebook_category") print(" Relation many-to-many:
 ebook_category") else:
 print(" Relation many-to-many manquante") 
# One-to-many relationships if 'db.relationship' in content:
 relationships.append("One-to-many relationships") print(" Relations one-to-many presentes") else:
 print(" Relations one-to-many manquantes") 
# Foreign keys if 'db.ForeignKey' in content:
 relationships.append("Foreign keys") print(" Cles etrangeres presentes") else:
 print(" Cles etrangeres manquantes") return len(relationships) >= 3 except Exception as e:
 print(f" Erreur lors de l'analyse:
 {e}") return False 
def check_authentication():
 """Vérifier le système d'authentification""" print("\nVerification du systeme d'authentification...") auth_features = [] 
# Vérifier JWT if os.path.exists('routes/route_user.py'):
 with open('routes/route_user.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'flask_jwt_extended' in content:
 auth_features.append("JWT Authentication") print(" JWT Authentication") else:
 print(" JWT Authentication manquant") if 'create_access_token' in content:
 auth_features.append("Token Creation") print(" Token Creation") else:
 print(" Token Creation manquant") if 'jwt_required' in content:
 auth_features.append("Route Protection") print(" Route Protection") else:
 print(" Route Protection manquant") 
# Vérifier le hachage des mots de passe if os.path.exists('models.py'):
 with open('models.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'hash_password' in content and 'check_password' in content:
 auth_features.append("Password Hashing") print(" Password Hashing") else:
 print(" Password Hashing manquant") return len(auth_features) >= 3 
def check_crud_operations():
 """Vérifier les opérations CRUD""" print("\nVerification des operations CRUD...") crud_operations = [] 
# Vérifier les routes CRUD pour les utilisateurs if os.path.exists('routes/route_user.py'):
 with open('routes/route_user.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'POST' in content and 'GET' in content and 'PUT' in content and 'DELETE' in content:
 crud_operations.append("User CRUD") print(" User CRUD complet") else:
 print(" User CRUD incomplet") 
# Vérifier les routes CRUD pour les livres if os.path.exists('routes/routes_ebook.py'):
 with open('routes/routes_ebook.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'POST' in content and 'GET' in content and 'PUT' in content and 'DELETE' in content:
 crud_operations.append("Book CRUD") print(" Book CRUD complet") else:
 print(" Book CRUD incomplet") 
# Vérifier les routes CRUD pour les catégories if os.path.exists('routes/route_category.py'):
 with open('routes/route_category.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'POST' in content and 'GET' in content and 'PUT' in content and 'DELETE' in content:
 crud_operations.append("Category CRUD") print(" Category CRUD complet") else:
 print(" Category CRUD incomplet") 
# Vérifier les routes CRUD pour les emprunts if os.path.exists('routes/route_loan.py'):
 with open('routes/route_loan.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'POST' in content and 'GET' in content and 'PUT' in content and 'DELETE' in content:
 crud_operations.append("Loan CRUD") print(" Loan CRUD complet") else:
 print(" Loan CRUD incomplet") return len(crud_operations) >= 4 
def check_error_handling():
 """Vérifier la gestion des erreurs""" print("\nVerification de la gestion des erreurs...") error_handling = [] 
# Vérifier les try-catch blocks route_files = [ 'routes/route_user.py', 'routes/routes_ebook.py', 'routes/route_category.py', 'routes/route_loan.py' ] for file_path in route_files:
 if os.path.exists(file_path):
 with open(file_path, 'r', encoding='utf-8') as f:
 content = f.read() if 'try:
' in content and 'except' in content:
 error_handling.append(f"Error handling in {file_path}") print(f" Error handling in {file_path}") else:
 print(f" Error handling manquant in {file_path}") 
# Vérifier les validations if os.path.exists('routes/route_user.py'):
 with open('routes/route_user.py', 'r', encoding='utf-8') as f:
 content = f.read() if 'if not' in content and 'return jsonify' in content:
 error_handling.append("Input validation") print(" Input validation") else:
 print(" Input validation manquant") return len(error_handling) >= 3 
def main():
 """Fonction principale""" print("VERIFICATION DE LA STRUCTURE BACKEND E-LIB") print("=" * 60) 
# Vérifier les fichiers principaux print("\nVerification des fichiers principaux...") required_files = [ ('app.py', 'Application principale'), ('models.py', 'Modèles de données'), ('config.py', 'Configuration'), ('requirements.txt', 'Dépendances'), ('routes/route_user.py', 'Routes utilisateurs'), ('routes/routes_ebook.py', 'Routes livres'), ('routes/route_category.py', 'Routes catégories'), ('routes/route_loan.py', 'Routes emprunts'), ('utils/email_service.py', 'Service email'), ('utils/check_expired_loans.py', 'Vérification emprunts expirés') ] files_ok = 0 for file_path, description in required_files:
 if check_file_exists(file_path, description):
 files_ok += 1 
# Vérifier les endpoints API routes = check_api_endpoints() 
# Vérifier les modèles models = check_models() 
# Vérifier les relations de base de données relationships_ok = check_database_relationships() 
# Vérifier l'authentification auth_ok = check_authentication() 
# Vérifier les opérations CRUD crud_ok = check_crud_operations() 
# Vérifier la gestion des erreurs error_handling_ok = check_error_handling() 
# Résumé print("\n" + "=" * 60) print("RESUME DE LA VERIFICATION") print("=" * 60) print(f"Fichiers:
 {files_ok}/{len(required_files)}") print(f"Routes API:
 {len(routes)}") print(f"Modeles:
 {len(models)}") print(f"Relations DB:
 {'OK' if relationships_ok else 'MANQUANT'}") print(f"Authentification:
 {'OK' if auth_ok else 'MANQUANT'}") print(f"CRUD Operations:
 {'OK' if crud_ok else 'MANQUANT'}") print(f"Gestion erreurs:
 {'OK' if error_handling_ok else 'MANQUANT'}") 
# Score total total_score = 0 if files_ok >= len(required_files) * 0.8:
 
# 80% des fichiers total_score += 1 if len(routes) >= 10:
 
# Au moins 10 routes total_score += 1 if len(models) >= 4:
 
# Au moins 4 modèles total_score += 1 if relationships_ok:
 total_score += 1 if auth_ok:
 total_score += 1 if crud_ok:
 total_score += 1 if error_handling_ok:
 total_score += 1 print(f"\nScore total:
 {total_score}/7") if total_score >= 6:
 print("EXCELLENT! Le backend est bien structure") return True elif total_score >= 4:
 print("BON! Le backend est fonctionnel avec quelques ameliorations possibles") return True else:
 print("ATTENTION! Le backend necessite des ameliorations") return False if __name__ == '__main__':
 success = main() sys.exit(0 if success else 1) 