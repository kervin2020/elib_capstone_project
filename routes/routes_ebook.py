from flask import Blueprint,request,jsonify
from models import Ebook,User
from config import db
from flask_jwt_extended import jwt_required,get_jwt_identity

#creation  Blueprint pour route des livre
ebook_bp = Blueprint('ebook_bp',__name__)

# route pour creer un livre
@ebook_bp.route('/ebooks',methods=['POST'])
@jwt_required()
def create_ebook():
    if not User.current_is_admin():
        return jsonify({"msg":"Acces interdit, vous n etes pas administrateur"}),403
    data = request.get_json()
    new_ebook = Ebook(**data)
    db.session.add(new_ebook)
    db.session.commit()
    return jsonify({'message':'Ebook cree avec succes','ebook':{
            'id':new_ebook.id,
            'title':new_ebook.title,
            'author':new_ebook.author,
            'description':new_ebook.description,
            'file_path':new_ebook.file_path,
            'total_copies':new_ebook.total_copies,
            'available_copies':new_ebook.available_copies,
            'uploaded_at':new_ebook.uploaded_at
        }}),201

# route pour recuperer toutes les livres 
@ebook_bp.route('/ebooks',methods=['GET'])
def get_ebooks():
    ebooks = Ebook.query.all()     
    ebooks_list = []
    for ebook in ebooks:
        ebooks_list.append({
            'id':ebook.id,
            'title':ebook.title,
            'author':ebook.author,
            'description':ebook.description,
            'file_path':ebook.file_path,
            'total_copies':ebook.total_copies,
            'available_copies':ebook.available_copies,
            'uploaded_at':ebook.uploaded_at
        })
    return jsonify(ebooks_list),200  

# route pour recuperer un livre par son id
@ebook_bp.route('/ebooks/<int:ebook_id>',methods=['GET'])
def get_ebook(ebook_id):
    ebook = Ebook.query.get_or_404(ebook_id)
    return jsonify({
            'id':ebook.id,
            'title':ebook.title,
            'author':ebook.author,
            'description':ebook.description,
            'file_path':ebook.file_path,
            'total_copies':ebook.total_copies,
            'available_copies':ebook.available_copies,
            'uploaded_at':ebook.uploaded_at
        }),200

# route pour supprimer un livre
@ebook_bp.route('/ebooks/<int:ebook_id>',methods=['DELETE'])
@jwt_required()
def delete_ebook(ebook_id):
    if not User.current_is_admin():
        return jsonify({"msg":"Acces interdit, vous n etes pas admin"}),403
    ebook = Ebook.query.get_or_404(ebook_id)
    db.session.delete(ebook)
    db.session.commit()
    return jsonify({'message':'Ebook supprime avec succes'}),200

# route pour mettre a jour un livre
@ebook_bp.route('/ebooks/<int:ebook_id>',methods=['PUT'])
@jwt_required()
def update_ebook(ebook_id):
    if not User.current_is_admin():
        return jsonify({"msg":"Acces interdit, vous n etes pas admin"}),403
    ebook = Ebook.query.get_or_404(ebook_id)
    data = request.get_json()
    ebook.title = data.get('title',ebook.title)
    ebook.author = data.get('author',ebook.author)
    ebook.description = data.get('description',ebook.description)
    ebook.file_path = data.get('file_path',ebook.file_path)
    ebook.total_copies = data.get('total_copies',ebook.total_copies)    
    ebook.available_copies = data.get('available_copies',ebook.available_copies)
    ebook.uploaded_at = data.get('uploaded_at',ebook.uploaded_at)
    db.session.commit()
    return jsonify({'message':'Ebook mis a jour avec succes','ebook':{
            'id':ebook.id,
            'title':ebook.title,
            'author':ebook.author,
            'description':ebook.description,    
            'file_path':ebook.file_path,
            'total_copies':ebook.total_copies,
            'available_copies':ebook.available_copies,
            'uploaded_at':ebook.uploaded_at
        }}),200
