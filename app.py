from flask import Flask
from config import db,jwt,migrate,cors,bcrypt
from models import User,Ebook,Category,Loan

# initialisation de notre application Flask
def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app,db)
    cors.init_app(app)
    bcrypt.init_app(app)

    # ajoutons une routes d accueil
    @app.route('/')
    def home():
        return f"Bienvenue dans la bibliothèque numérique!"

    with app.app_context():
        db.create_all()  # Créer les tables dans la base de données

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000,debug=True)