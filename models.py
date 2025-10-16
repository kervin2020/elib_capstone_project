from config import db
from datetime import datetime

# table d association entre les livre et categories
ebook_category = db.Table('ebook_category',
    db.Column('ebook_id', db.Integer, db.ForeignKey('ebooks.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'))

)

# Creation des models(tables)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # contien hash c est a dire mot de passe non chiffre
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    loans = db.relationship('Loan', backref='user', lazy=True)# relation one to many entre user et loan

    def __repr__(self):
        return f'<User {self.username}>'


class Ebook(db.Model):
    __tablename__ = 'ebooks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(40))
    author = db.Column(db.String(70))
    description = db.Column(db.Text)
    file_path = db.Column(db.String(200), nullable=False) # chemin du fichier ebook
    total_copies = db.Column(db.Integer, default=1) # nomvre total d'exemplaire
    available_copies = db.Column(db.Integer, default=1) # nombre d'exemplaire disponible
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow) 

    categories = db.relationship('Category', secondary=ebook_category, backref=db.backref('ebooks', lazy='dynamic')) # relation many to many entre ebook et category
    loans = db.relationship('Loan', backref='ebook', lazy=True) # relation one to many entre ebook et loan

def __repr__(self):
        return f'<Ebook {self.title} by {self.author}>'

class Category(db.Model):
     __tablename__ = 'categories'
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(50), unique=True, nullable=False)

     ebooks=db.relationship('Ebook', secondary=ebook_category, backref=db.backref('categories', lazy='dynamic')) # relation many to many entre ebook et category

     def __repr__(self):
        return f'<Category {self.name}>'

class Loan(db.Model):
     __tablename__ = 'loans'
     id = db.Column(db.Integer, primary_key=True)
     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
     ebook_id = db.Column(db.Integer, db.ForeignKey('ebooks.id'), nullable=False)
     loan_date = db.Column(db.DateTime, default=datetime.utcnow)
     due_date = db.Column(db.DateTime, nullable=False)
     return_date = db.Column(db.DateTime, nullable=True)
     is_returned = db.Column(db.Boolean, default=False)

     user = db.relationship('User', backref=db.backref('loans', lazy=True)) # relation one to many entre user et loan
     ebook = db.relationship('Ebook', backref=db.backref('loans', lazy=True)) # relation one to many entre ebook et loan

def __repr__(self):
        return f'<Loan User {self.user_id} - Ebook {self.ebook_id}>'
       
          
