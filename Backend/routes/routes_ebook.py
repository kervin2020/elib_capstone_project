from config import db
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Ebook, User


# Blueprint for ebook routes
ebook_bp = Blueprint('ebook_bp', __name__)

# Check if user is admin
def _require_admin():
    """
    Vérifie si l'utilisateur est administrateur

    securite:
        -jwt:[]
    response:
        200:
            description: Accès autorisé
        403:
            description: Accès interdit, vous n'êtes pas administrateur
    """
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Accès interdit, vous n'êtes pas administrateur"}), 403
    return None

<<<<<<< HEAD

# Create new book
@ebook_bp.route('/ebooks', methods=['POST'])
@jwt_required()
def create_ebook():
=======
 # route pour creer un livre
@ebook_bp.route('/ebooks', methods=['POST'])
@jwt_required()
def create_ebook():
    """
    creer un nouveau livre

    securite:
        -jwt:[]
    parameter:
        - in: body
          name: ebook
          schema:
            type: object
            properties:
              title:
                type: string
              author:
                type: string
              description:
                type: string  
              file_path:
                type: string
              total_copies:
                type: integer
              available_copies:
                type: integer
              uploaded_at:
                type: string
            required:
              - title
              - file_path
    responses:
        201:
            description: Ebook créé avec succès
        400:
            description: Le titre et le chemin du fichier sont requis
        403:
            description: Accès interdit, vous n'êtes pas administrateur
    """
>>>>>>> e26e354 (the last)
    err = _require_admin()
    if err:
        return err

    data = request.get_json()

    if not data.get('title') or not data.get('file_path'):
        return jsonify({"msg": "Le titre et le chemin du fichier sont requis"}), 400

    new_ebook = Ebook(**data)
    db.session.add(new_ebook)
    db.session.commit()

    return jsonify({
        "msg": "Ebook créé avec succès",
        "ebook": {
            'id': new_ebook.id,
            'title': new_ebook.title,
            'author': new_ebook.author,
            'description': new_ebook.description,
            'file_path': new_ebook.file_path,
            'total_copies': new_ebook.total_copies,
            'available_copies': new_ebook.available_copies,
            'uploaded_at': new_ebook.uploaded_at
        }
    }), 201


<<<<<<< HEAD
# Get all books
@ebook_bp.route('/ebooks', methods=['GET'])
def get_ebooks():
    ebooks = Ebook.query.all()
    return jsonify({'ebooks': [
        {
            'id': ebook.id,
            'title': ebook.title,
            'author': ebook.author,
            'description': ebook.description,
            'file_path': ebook.file_path,
            'total_copies': ebook.total_copies,
            'available_copies': ebook.available_copies,
            'uploaded_at': ebook.uploaded_at
        } for ebook in ebooks
    ]}), 200


# Get book by ID
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['GET'])
def get_ebook(ebook_id):
    ebook = Ebook.query.get_or_404(ebook_id)
    return jsonify({
=======

# route pour recuperer toutes les livres
@ebook_bp.route('/ebooks', methods=['GET'])
def get_ebooks():
    """
    Récupérer tous les ebooks

    tags:
        - ebooks
    responses:
        200:
            description: Liste des ebooks récupérée avec succès
        404:
            description: Aucun ebook trouvé
    """
    ebooks = Ebook.query.all()
    return jsonify({'ebooks': [
    {
>>>>>>> e26e354 (the last)
        'id': ebook.id,
        'title': ebook.title,
        'author': ebook.author,
        'description': ebook.description,
        'file_path': ebook.file_path,
        'total_copies': ebook.total_copies,
        'available_copies': ebook.available_copies,
        'uploaded_at': ebook.uploaded_at
<<<<<<< HEAD
    }), 200


# Update book
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['PUT'])
@jwt_required()
def update_ebook(ebook_id):
    err = _require_admin()
    if err:
        return err

    ebook = Ebook.query.get_or_404(ebook_id)
    data = request.get_json()

    ebook.title = data.get('title', ebook.title)
    ebook.author = data.get('author', ebook.author)
    ebook.description = data.get('description', ebook.description)
    ebook.file_path = data.get('file_path', ebook.file_path)
    ebook.total_copies = data.get('total_copies', ebook.total_copies)
    ebook.available_copies = data.get('available_copies', ebook.available_copies)
    ebook.uploaded_at = data.get('uploaded_at', ebook.uploaded_at)

=======
    } for ebook in ebooks
    ]}), 200


# route pour recuperer un livre par son id
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['GET'])
def get_ebook(ebook_id):
    """
    Récupérer un ebook par son ID

    tags:
        - ebooks
    parameters:
        - in: path
          name: ebook_id
          required: true
          schema:
            type: integer
    responses:
        200:
            description: livre récupéré avec succès
        404:
            description: livre non trouvé
    """
    ebook = Ebook.query.get_or_404(ebook_id)
    return jsonify({
        'id': ebook.id,
        'title': ebook.title,
        'author': ebook.author,
        'description': ebook.description,
        'file_path': ebook.file_path,
        'total_copies': ebook.total_copies,
        'available_copies': ebook.available_copies,
        'uploaded_at': ebook.uploaded_at
    }), 200


# route pour mettre a jour un livre
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['PUT'])
@jwt_required()
def update_ebook(ebook_id):
    """
    Mettre à jour un ebook existant

    tags:
        - ebooks
    parameters:
        - in: path
          name: ebook_id
          required: true
          schema:
            type: integer
        - in: body
          name: ebook
          schema:
            type: object
            properties:
              title:
                type: string
              author:
                type: string
              description:
                type: string
              file_path:
                type: string
              total_copies:
                type: integer
              available_copies:
                type: integer
              uploaded_at:
                type: string
            required:
              - title
              - file_path
    responses:
        200:
            description: Ebook mis à jour avec succès
        400:
            description: Le titre et le chemin du fichier sont requis
        403:
            description: Accès interdit, vous n'êtes pas administrateur
        404:
            description: Ebook non trouvé

    """
    err = _require_admin()
    if err:
        return err

    ebook = Ebook.query.get_or_404(ebook_id)
    data = request.get_json()

    ebook.title = data.get('title', ebook.title)
    ebook.author = data.get('author', ebook.author)
    ebook.description = data.get('description', ebook.description)
    ebook.file_path = data.get('file_path', ebook.file_path)
    ebook.total_copies = data.get('total_copies', ebook.total_copies)
    ebook.available_copies = data.get('available_copies', ebook.available_copies)
    ebook.uploaded_at = data.get('uploaded_at', ebook.uploaded_at)

>>>>>>> e26e354 (the last)
    db.session.commit()

    return jsonify({
        "msg": "Ebook mis à jour avec succès",
        "ebook": {
            'id': ebook.id,
            'title': ebook.title,
            'author': ebook.author,
            'description': ebook.description,
            'file_path': ebook.file_path,
            'total_copies': ebook.total_copies,
            'available_copies': ebook.available_copies,
            'uploaded_at': ebook.uploaded_at
        }
    }), 200


<<<<<<< HEAD
# Delete book
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['DELETE'])
@jwt_required()
def delete_ebook(ebook_id):
=======
# route pour supprimer un livre
@ebook_bp.route('/ebooks/<int:ebook_id>', methods=['DELETE'])
@jwt_required()
def delete_ebook(ebook_id):
    """
    Supprimer un ebook
    tags:
        - ebooks
    parameters:
        - in: path
          name: ebook_id
          required: true
          schema:
            type: integer
    responses:
        200:
            description: livre supprimé avec succès
        403:
            description: Accès interdit, vous n'êtes pas administrateur
        404:
            description: livre non trouvé
    """
>>>>>>> e26e354 (the last)
    err = _require_admin()
    if err:
        return err

    ebook = Ebook.query.get_or_404(ebook_id)
    db.session.delete(ebook)
    db.session.commit()

    return jsonify({"msg": "Ebook supprimé avec succès"}), 200