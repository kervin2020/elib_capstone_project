from flask import Blueprint, request, jsonify
from models import User
from config import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

# creation Blueprint pour route des utilisateur
user_bp = Blueprint('user_bp', __name__)

# fonction pour vérifier si l'utilisateur est admin
def _require_admin(user_id=None):
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"msg": "Utilisateur non trouvé"}), 404
    if user_id is None:
        if not user.is_admin:
            return jsonify({"msg": "Accès interdit, vous n'êtes pas administrateur"}), 403
    else:
        if not (user.is_admin or get_jwt_identity() == user_id):
            return jsonify({"msg": "Accès interdit, vous n'êtes pas propriétaire du compte ou administrateur"}), 403
    return None

# route pour creer un utilisateur
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Nom d'utilisateur, email et mot de passe sont requis"}), 400
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=User.hash_password(data['password']),
        is_admin=data.get('is_admin', False)
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "msg": "Utilisateur créé avec succès",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "is_admin": new_user.is_admin
        }
    }), 201

# route pour afficher les utilisateur 
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    err = _require_admin()
    if err:
        return err
    
    users = User.query.all()
    return jsonify({'users': [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
            'created_at': user.created_at
        } for user in users
    ]}), 200

# route pour afficher un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    err = _require_admin(user_id)
    if err:
        return err
    
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_admin': user.is_admin,
        'created_at': user.created_at
    }), 200

# route pour modifier un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    err = _require_admin(user_id)
    if err:
        return err
    
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = User.hash_password(data['password'])
    user.is_admin = data.get('is_admin', user.is_admin)
    
    db.session.commit()
    
    return jsonify({
        "msg": "Utilisateur mis à jour avec succès",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 200

# route pour supprimer un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    err = _require_admin(user_id)
    if err:
        return err
    
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({"msg": "Utilisateur supprimé avec succès"}), 200

# route pour connexion utilisateur
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Email et mot de passe sont requis"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and User.check_password(data['password'], user.password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({"msg": "Email ou mot de passe incorrect"}), 401