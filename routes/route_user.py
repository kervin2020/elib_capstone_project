from flask import Blueprint,request,jsonify
from models import User
from config import db,bcrypt
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from datetime import timedelta

# creation Blueprint pour route des utilisateur
user_bp = Blueprint('user_bp',__name__)

# route pour creer un utilisateur
@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=User.hash_password(data['password']),
        is_admin=data.get('is_admin',False)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':'Utilisateur creer avec succes'}),201

# route pour afficher les utilisateur 
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    if not User.current_is_admin():
        return jsonify({"msg":"Acces interdit, vous n etes pas administrateur"}),403
    users = User.query.all()
    user_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
            'created_at': user.created_at
        }
        user_list.append(user_data)
    return jsonify({'users': user_list}), 200

# route pour afficher un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    if not User.current_is_admin(user_id):
        return jsonify({"msg":"Acces interdit, vous n etes pas proprietaire du compte ou administrateur"}),403
    user = User.query.get_or_404(user_id)
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_admin': user.is_admin,
        'created_at': user.created_at
    }
    return jsonify({'user': user_data}), 200

# route pour modifier un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    if not User.current_is_admin(user_id):
        return jsonify({"msg":"Acces interdit, vous n etes pas autoriser a modifier cet utilisateur"}),403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.password = User.hash_password(data['password'])
    user.is_admin = data.get('is_admin', user.is_admin)
    db.session.commit()
    return jsonify({'message':'L utilisateur a ete mis a jour avec succes'}), 200

# route pour supprimer un utilisateur
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    if not User.current_is_admin(user_id):
        return jsonify({"msg":"Acces interdit, vous n etes pas autoriser a supprimer cet utilisateur"}),403
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message':'Utilisateur supprime avec succes'}), 200

# route pour connexion utilisateur
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and User.check_password(data['password'],user.password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message':'Email ou mot de passe incorrect'}), 401
    



