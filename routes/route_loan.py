from flask import Blueprint,request,jsonify
from models import Ebook,User,Loan
from config import db
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import datetime, timedelta

loan_bp = Blueprint('loan_bp',__name__)

# route pour creer un emprunt 
@loan_bp.route('/loan', methods =['POST'])
@jwt_required()
def create_loan():
    data = request.get_json()
    user_id = get_jwt_identity()
    ebook = Ebook.query.get_or_404(data['ebook_id'])
    if ebook.available_copies < 1:
        return jsonify({'message':'Aucune copie disponible pour ce livre'}),400
    
    new_loan = Loan(
        user_id = user_id,
        ebook_id = ebook.id,
        loan_date = datetime.utcnow(),
    )
    ebook.available_copies -= 1
    db.session.add(new_loan)
    db.session.commit()
    return jsonify({'message':'Emprunt cree avec succes','loan':{
            'id':new_loan.id,
            'user_id':new_loan.user_id, 
            'ebook_id':new_loan.ebook_id,
            'loan_date':new_loan.loan_date
        }}),201

#route pour afficher les prets  d'utilisateurs
@loan_bp.route('/loans', methods=['GET'])
@jwt_required()
def get_loans():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user.is_admin:
        return jsonify({"msg":"Acces interdit, vous n etes pas administrateur"}),403
    loans = Loan.query.all()
    loan_list = []
    for loan in loans:
        loan_data = {
            'id':loan.id,
            'user_id':loan.user_id,
            'ebook_id':loan.ebook_id,
            'loan_date':loan.loan_date
        }
        loan_list.append(loan_data)
    return jsonify({'loans':loan.list}),200

# route pour modifier un pret d utilisateur
@loan_bp.route('/loans/<int:loan_id>', methods=['PUT'])
@jwt_required()
def update_loan(loan_id):
    loan = Loan.query.get_or_404(loan_id)
    if loan.user_id != get_jwt_identity():
        return jsonify({"msg":"Acces interdit, vous n etes pas proprietaire de ce pret"}),403

    if loan.return_date:
        return jsonify({'message':'Ce pret a deja ete retourne'}),400

    loan.return_date = True
    loan.return_date = datetime.utcnow()
    loan.ebook.available_copies += 1
    db.session.commit()
    return jsonify({'message':f'Pret DU LIVRE {loan.ebook.title} a ete mis a jour avec succes'}),200