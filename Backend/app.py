from flask import Flask, request
from config import db, jwt, migrate, cors, bcrypt
from models import User, Ebook, Category, Loan

# importation des blueprints
from routes.route_user import user_bp
from routes.routes_ebook import ebook_bp
from routes.route_category import category_bp
from routes.route_loan import loan_bp

#  utilitaires
from utils.check_expired_loans import check_and_notify
from utils.email_service import send_email


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # init extensions (but NOT cors yet)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    # Configure CORS properly - ONLY ONCE!
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Add after_request handler to ensure CORS headers
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in ['http://localhost:5173', 'http://127.0.0.1:5173']:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
        return response

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
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(ebook_bp, url_prefix='/api')
    app.register_blueprint(category_bp, url_prefix='/api')
    app.register_blueprint(loan_bp, url_prefix='/api')

    # création tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
