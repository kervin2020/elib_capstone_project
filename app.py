from flask import Flask
from config import db, jwt, migrate, cors, bcrypt
from models import User, Ebook, Category, Loan

# importation des blueprints 
from routes.route_user    import user_bp
from routes.routes_ebook  import ebook_bp
from routes.route_category import category_bp
from routes.route_loan    import loan_bp

#  utilitaires 
from utils.check_expired_loans import check_and_notify
from utils.email_service import send_email


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # init extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    bcrypt.init_app(app)

    #  route d'accueil
    @app.route('/')
    def index():
        import urllib
        output = []
        for rule in app.url_map.iter_rules():
            methods = ','.join(sorted(rule.methods))
            line = urllib.parse.unquote(f"{methods:25s}  {rule}")
            output.append(line)
        return "<pre>" + '\n'.join(sorted(output)) + "</pre>"

    # enregistrement blueprints
    app.register_blueprint(user_bp,   url_prefix='/api')
    app.register_blueprint(ebook_bp,  url_prefix='/api')
    app.register_blueprint(category_bp, url_prefix='/api')
    app.register_blueprint(loan_bp,   url_prefix='/api')

    # création tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)