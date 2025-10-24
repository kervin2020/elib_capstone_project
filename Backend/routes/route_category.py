from flask import Blueprint, request, jsonify
from models import Category, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity

category_bp = Blueprint('category_bp', __name__)


# fonction pour vérifier si l'utilisateur est admin
def _require_admin():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Accès interdit, vous n'êtes pas administrateur"}), 403
    return None


# Pour créer une nouvelle catégorie
@category_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    err = _require_admin()
    if err:
        return err

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"msg": "Le nom de la catégorie est requis"}), 400

    new_category = Category(name=name, description=description or "")
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        "msg": "Catégorie créée",
        "category": {
            "id": new_category.id,
            "name": new_category.name,
            "description": new_category.description
        }
    }), 201


# pour lister toutes les catégories
@category_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify({'categories': [
        {
            'id': c.id,
            'name': c.name,
            'description': c.description or ""
        } for c in categories
    ]}), 200


# pour afficher une catégorie spécifique
@category_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get_or_404(category_id)
    return jsonify({
        'id': category.id,
        'name': category.name,
        'description': category.description or ""
    }), 200


# Pour modiefier une catégorie
@category_bp.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    err = _require_admin()
    if err:
        return err

    category = Category.query.get_or_404(category_id)
    data = request.get_json()

    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description or "")
    db.session.commit()

    return jsonify({
        "msg": "Catégorie mise à jour",
        "category": {
            "id": category.id,
            "name": category.name,
            "description": category.description
        }
    }), 200


# route pour supprimmer une categorie
@category_bp.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    err = _require_admin()
    if err:
        return err

    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()

    return jsonify({"msg": "Catégorie supprimée"}), 200
