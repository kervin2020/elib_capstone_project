# E-Lib Digital Library Management System

## Overview
E-Lib is a comprehensive digital library management system built with Flask (Python) backend and React (JavaScript) frontend. It provides a complete solution for managing digital books, users, categories, and loans.

## Features

### Backend Features
- **User Management**: Registration, authentication, role-based access control
- **Book Management**: CRUD operations for digital books
- **Category Management**: Organize books by categories
- **Loan Management**: Borrow and return books with due dates
- **Admin Dashboard**: Comprehensive admin interface
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: JWT authentication, password hashing, CORS protection

### Frontend Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Authentication**: Login/Register with JWT tokens
- **Book Browsing**: Search, filter, and view books
- **Loan Management**: Borrow and return books
- **Admin Interface**: Complete admin dashboard
- **Real-time Updates**: Toast notifications and state management

## Technology Stack

### Backend
- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Bcrypt**: Password hashing
- **Flask-Migrate**: Database migrations
- **Flask-RESTX**: API documentation with Swagger

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Context API**: State management

### Database
- **SQLite**: Development database
- **PostgreSQL**: Production database (configurable)

## API Endpoints

### Authentication
- `POST /api/users` - Register new user
- `POST /api/login` - User login
- `GET /api/users/me` - Get current user info

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get user by ID
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user

### Books
- `GET /api/ebooks` - Get all books
- `GET /api/ebooks/<id>` - Get book by ID
- `POST /api/ebooks` - Create book (Admin only)
- `PUT /api/ebooks/<id>` - Update book (Admin only)
- `DELETE /api/ebooks/<id>` - Delete book (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/<id>` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/<id>` - Update category (Admin only)
- `DELETE /api/categories/<id>` - Delete category (Admin only)

### Loans
- `GET /api/loans` - Get loans (Admin: all, User: own loans)
- `GET /api/loans/<id>` - Get loan by ID
- `POST /api/loans` - Create loan
- `PUT /api/loans/<id>` - Return book
- `DELETE /api/loans/<id>` - Delete loan (Admin only)
- `GET /api/users/<id>/loans` - Get user's loans

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv virtual
   source virtual/bin/activate  # On Windows: virtual\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize database:
   ```bash
   python init_db.py
   ```

5. Run the backend server:
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5000`
API documentation will be available at `http://localhost:5000/docs/`

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend/elib-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
elib_capstone_project/
├── Backend/
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models.py               # Database models
│   ├── api_docs.py             # Swagger documentation
│   ├── requirements.txt        # Python dependencies
│   ├── routes/                 # API route handlers
│   │   ├── route_user.py       # User routes
│   │   ├── routes_ebook.py    # Book routes
│   │   ├── route_category.py   # Category routes
│   │   └── route_loan.py        # Loan routes
│   ├── utils/                  # Utility functions
│   │   ├── email_service.py    # Email notifications
│   │   └── check_expired_loans.py # Loan expiration checker
│   └── tests/                  # Test files
│       ├── test_backend.py     # Backend tests
│       └── run_tests.py        # Test runner
├── Frontend/
│   └── elib-frontend/
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   │   ├── auth/        # Authentication components
│       │   │   ├── books/       # Book-related components
│       │   │   └── common/      # Common components
│       │   ├── contexts/        # React contexts
│       │   ├── pages/          # Page components
│       │   └── tests/          # Frontend tests
│       ├── package.json        # Node.js dependencies
│       └── vite.config.js      # Vite configuration
└── PROJECT_DOCUMENTATION.md    # This file
```

## Usage

### For Regular Users
1. **Register/Login**: Create an account or login
2. **Browse Books**: Search and filter books by category
3. **Borrow Books**: Click "Borrow" on available books
4. **Manage Loans**: View active loans and return books
5. **View History**: Check your loan history

### For Administrators
1. **User Management**: View, edit, and manage users
2. **Book Management**: Add, edit, and delete books
3. **Category Management**: Organize books by categories
4. **Loan Oversight**: Monitor all loans and overdue books
5. **Analytics**: View system statistics and reports

## Testing

### Backend Tests
```bash
cd Backend
python run_tests.py
```

### Frontend Tests
```bash
cd Frontend/elib-frontend
npm test
```

## Configuration

### Environment Variables
Create a `.env` file in the Backend directory:

```env
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
DATABASE_URI=sqlite:///bibliotheque.db
```

### Database Configuration
The system uses SQLite by default. To use PostgreSQL:

1. Install PostgreSQL
2. Update `DATABASE_URI` in your environment variables
3. Run migrations: `flask db upgrade`

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing
- **CORS Protection**: Configured for specific origins
- **Role-based Access**: Admin and user roles
- **Input Validation**: Server-side validation for all inputs

## Performance Considerations

- **Database Indexing**: Optimized database queries
- **Lazy Loading**: Efficient data loading
- **Caching**: Frontend state management
- **Pagination**: Large dataset handling

## Deployment

### Backend Deployment
1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Use a WSGI server (Gunicorn)
4. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files with a web server
3. Configure API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Changelog

### Version 1.0.0
- Initial release
- Complete user management system
- Book management with categories
- Loan system with due dates
- Admin dashboard
- API documentation
- Responsive frontend
- Comprehensive testing
