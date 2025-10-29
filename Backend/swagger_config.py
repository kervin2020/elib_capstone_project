""" Configuration Swagger/openApi pour l'API E-LIB """

swagger_config = {
    "headers": [
    ],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,  # test   
            "model_filter": lambda tag: True,  # test
        },
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/docs"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "E-Lib API - Système de Gestion de Bibliothèque",
        "description": "API pour le système de gestion de bibliothèque E-Lib.",
        "version": "1.0.0",
        "contact": {
            "name": "Support E-Lib",
            "email": "support@elib.com"
        }
    },
    "host": "localhost:5000",
    "basePath": "/",
    "schemes": ["http"],
    "securityDefinitions": {
        "jwt": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Token JWT au format: Bearer <token>"
        }
    },
    "tags": [
        {
            "name": "Authentification",
            "description": "Connexion et gestion des sessions"
        },
        {
            "name": "Utilisateurs",
            "description": "Gestion des comptes utilisateurs"
        },
        {
            "name": "Ebooks",
            "description": "Gestion de la bibliothèque de livres"
        },
        {
            "name": "Catégories",
            "description": "Gestion des catégories de livres"
        },
        {
            "name": "Emprunts",
            "description": "Système d'emprunt et de retour"
        }
    ]
}