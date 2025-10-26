"""
Database Seeder Script
This script creates an admin user and populates the database with realistic data
"""

from app import app, db
from models import User, Category, Ebook, Loan
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random


def clear_database():
    """Clear all existing data"""
    print("Clearing existing data...")
    Loan.query.delete()
    Ebook.query.delete()
    Category.query.delete()
    User.query.delete()
    db.session.commit()
    print("✓ Database cleared")


def create_admin_user():
    """Create admin user"""
    print("\nCreating admin user...")
    admin = User(
        username='admin',
        email='admin@elib.com',
        password_hash=generate_password_hash('Admin@123'),
        is_admin=True
    )
    db.session.add(admin)
    db.session.commit()
    print(f"✓ Admin user created")
    print(f"  Username: admin")
    print(f"  Email: admin@elib.com")
    print(f"  Password: Admin@123")
    return admin


def create_regular_users():
    """Create regular users"""
    print("\nCreating regular users...")
    users_data = [
        {'username': 'john_doe', 'email': 'john@example.com', 'password': 'User@123'},
        {'username': 'jane_smith', 'email': 'jane@example.com', 'password': 'User@123'},
        {'username': 'bob_wilson', 'email': 'bob@example.com', 'password': 'User@123'},
        {'username': 'alice_brown', 'email': 'alice@example.com', 'password': 'User@123'},
        {'username': 'charlie_davis',
            'email': 'charlie@example.com', 'password': 'User@123'},
    ]

    users = []
    for user_data in users_data:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password_hash=generate_password_hash(user_data['password']),
            is_admin=False
        )
        db.session.add(user)
        users.append(user)
        print(
            f"  ✓ {user_data['username']} ({user_data['email']}) - Password: {user_data['password']}")

    db.session.commit()
    return users


def create_categories():
    """Create book categories"""
    print("\nCreating categories...")
    categories_data = [
        {'name': 'Fiction', 'description': 'Fictional stories and novels'},
        {'name': 'Science Fiction',
            'description': 'Science fiction and futuristic stories'},
        {'name': 'Mystery', 'description': 'Mystery and thriller novels'},
        {'name': 'Romance', 'description': 'Romance and love stories'},
        {'name': 'Biography', 'description': 'Life stories and biographies'},
        {'name': 'History', 'description': 'Historical books and documentaries'},
        {'name': 'Science', 'description': 'Scientific books and research'},
        {'name': 'Technology', 'description': 'Technology and programming books'},
        {'name': 'Business', 'description': 'Business and entrepreneurship'},
        {'name': 'Self-Help', 'description': 'Personal development and self-help'},
    ]

    categories = []
    for cat_data in categories_data:
        category = Category(
            name=cat_data['name'],
            description=cat_data['description']
        )
        db.session.add(category)
        categories.append(category)
        print(f"  ✓ {cat_data['name']}")

    db.session.commit()
    return categories


def create_ebooks(categories):
    """Create ebooks"""
    print("\nCreating ebooks...")
    ebooks_data = [
        # Fiction
        {'title': 'The Great Gatsby', 'author': 'F. Scott Fitzgerald', 'category': 'Fiction',
         'description': 'A classic American novel set in the Jazz Age', 'isbn': '978-0-7432-7356-5',
         'publication_year': 1925, 'total_copies': 5, 'available_copies': 3},
        {'title': 'To Kill a Mockingbird', 'author': 'Harper Lee', 'category': 'Fiction',
         'description': 'A gripping tale of racial injustice and childhood innocence', 'isbn': '978-0-06-112008-4',
         'publication_year': 1960, 'total_copies': 4, 'available_copies': 2},
        {'title': '1984', 'author': 'George Orwell', 'category': 'Fiction',
         'description': 'A dystopian social science fiction novel', 'isbn': '978-0-452-28423-4',
         'publication_year': 1949, 'total_copies': 6, 'available_copies': 4},

        # Science Fiction
        {'title': 'Dune', 'author': 'Frank Herbert', 'category': 'Science Fiction',
         'description': 'Epic science fiction novel about desert planet Arrakis', 'isbn': '978-0-441-17271-9',
         'publication_year': 1965, 'total_copies': 5, 'available_copies': 3},
        {'title': 'The Martian', 'author': 'Andy Weir', 'category': 'Science Fiction',
         'description': 'Astronaut stranded on Mars must survive', 'isbn': '978-0-553-41802-6',
         'publication_year': 2011, 'total_copies': 4, 'available_copies': 4},
        {'title': 'Foundation', 'author': 'Isaac Asimov', 'category': 'Science Fiction',
         'description': 'Epic tale of galactic empire collapse and rebirth', 'isbn': '978-0-553-29335-0',
         'publication_year': 1951, 'total_copies': 3, 'available_copies': 2},

        # Mystery
        {'title': 'The Da Vinci Code', 'author': 'Dan Brown', 'category': 'Mystery',
         'description': 'Thriller involving art, codes, and conspiracy', 'isbn': '978-0-307-47927-1',
         'publication_year': 2003, 'total_copies': 5, 'available_copies': 1},
        {'title': 'Gone Girl', 'author': 'Gillian Flynn', 'category': 'Mystery',
         'description': 'Psychological thriller about a missing wife', 'isbn': '978-0-307-58836-4',
         'publication_year': 2012, 'total_copies': 4, 'available_copies': 3},

        # Technology
        {'title': 'Clean Code', 'author': 'Robert C. Martin', 'category': 'Technology',
         'description': 'A handbook of agile software craftsmanship', 'isbn': '978-0-132-35088-4',
         'publication_year': 2008, 'total_copies': 8, 'available_copies': 5},
        {'title': 'The Pragmatic Programmer', 'author': 'Andrew Hunt', 'category': 'Technology',
         'description': 'Your journey to mastery', 'isbn': '978-0-135-95705-9',
         'publication_year': 2019, 'total_copies': 6, 'available_copies': 4},
        {'title': 'Python Crash Course', 'author': 'Eric Matthes', 'category': 'Technology',
         'description': 'A hands-on, project-based introduction to programming', 'isbn': '978-1-593-27928-8',
         'publication_year': 2019, 'total_copies': 7, 'available_copies': 6},

        # Business
        {'title': 'Think and Grow Rich', 'author': 'Napoleon Hill', 'category': 'Business',
         'description': 'The legendary bestseller on achieving success', 'isbn': '978-1-585-42433-9',
         'publication_year': 1937, 'total_copies': 5, 'available_copies': 3},
        {'title': 'The Lean Startup', 'author': 'Eric Ries', 'category': 'Business',
         'description': 'How today\'s entrepreneurs use continuous innovation', 'isbn': '978-0-307-88791-7',
         'publication_year': 2011, 'total_copies': 4, 'available_copies': 2},

        # Self-Help
        {'title': 'Atomic Habits', 'author': 'James Clear', 'category': 'Self-Help',
         'description': 'An easy and proven way to build good habits', 'isbn': '978-0-735-21129-2',
         'publication_year': 2018, 'total_copies': 6, 'available_copies': 4},
        {'title': 'The 7 Habits of Highly Effective People', 'author': 'Stephen Covey', 'category': 'Self-Help',
         'description': 'Powerful lessons in personal change', 'isbn': '978-1-982-13720-5',
         'publication_year': 1989, 'total_copies': 5, 'available_copies': 3},

        # History
        {'title': 'Sapiens', 'author': 'Yuval Noah Harari', 'category': 'History',
         'description': 'A brief history of humankind', 'isbn': '978-0-062-31609-7',
         'publication_year': 2011, 'total_copies': 5, 'available_copies': 3},
        {'title': 'The Guns of August', 'author': 'Barbara Tuchman', 'category': 'History',
         'description': 'The outbreak of World War I', 'isbn': '978-0-345-47609-8',
         'publication_year': 1962, 'total_copies': 3, 'available_copies': 2},

        # Biography
        {'title': 'Steve Jobs', 'author': 'Walter Isaacson', 'category': 'Biography',
         'description': 'The exclusive biography of Apple\'s co-founder', 'isbn': '978-1-451-64853-9',
         'publication_year': 2011, 'total_copies': 4, 'available_copies': 2},
        {'title': 'Becoming', 'author': 'Michelle Obama', 'category': 'Biography',
         'description': 'Memoir by the former First Lady', 'isbn': '978-1-524-76313-8',
         'publication_year': 2018, 'total_copies': 5, 'available_copies': 4},

        # Romance
        {'title': 'Pride and Prejudice', 'author': 'Jane Austen', 'category': 'Romance',
         'description': 'Classic romance novel about Elizabeth Bennet', 'isbn': '978-0-141-43951-8',
         'publication_year': 1813, 'total_copies': 4, 'available_copies': 3},
        {'title': 'The Notebook', 'author': 'Nicholas Sparks', 'category': 'Romance',
         'description': 'An enduring tale of love and devotion', 'isbn': '978-0-446-60523-9',
         'publication_year': 1996, 'total_copies': 3, 'available_copies': 2},
    ]

    # Create a dictionary for easy category lookup
    category_dict = {cat.name: cat for cat in categories}

    ebooks = []
    for ebook_data in ebooks_data:
        category = category_dict.get(ebook_data['category'])
        if category:
            ebook = Ebook(
                title=ebook_data['title'],
                author=ebook_data['author'],
                description=ebook_data['description'],
                isbn=ebook_data['isbn'],
                publication_year=ebook_data['publication_year'],
                category_id=category.id,
                total_copies=ebook_data['total_copies'],
                available_copies=ebook_data['available_copies']
            )
            db.session.add(ebook)
            ebooks.append(ebook)
            print(f"  ✓ {ebook_data['title']} by {ebook_data['author']}")

    db.session.commit()
    return ebooks


def create_loans(users, ebooks):
    """Create sample loans"""
    print("\nCreating sample loans...")

    # Create some active loans
    active_loans_data = [
        {'user_idx': 0, 'book_idx': 0, 'days_ago': 5, 'due_days': 9},
        {'user_idx': 1, 'book_idx': 3, 'days_ago': 3, 'due_days': 11},
        {'user_idx': 2, 'book_idx': 6, 'days_ago': 7, 'due_days': 7},
        {'user_idx': 3, 'book_idx': 8, 'days_ago': 2, 'due_days': 12},
    ]

    for loan_data in active_loans_data:
        user = users[loan_data['user_idx']]
        ebook = ebooks[loan_data['book_idx']]

        loan_date = datetime.utcnow() - timedelta(days=loan_data['days_ago'])
        due_date = loan_date + timedelta(days=14)

        loan = Loan(
            user_id=user.id,
            ebook_id=ebook.id,
            loan_date=loan_date,
            due_date=due_date,
            is_returned=False
        )
        db.session.add(loan)
        print(f"  ✓ Active: {user.username} borrowed '{ebook.title}'")

    # Create some overdue loans
    overdue_loans_data = [
        {'user_idx': 4, 'book_idx': 1, 'days_ago': 20, 'due_days': 14},
        {'user_idx': 0, 'book_idx': 2, 'days_ago': 18, 'due_days': 14},
    ]

    for loan_data in overdue_loans_data:
        user = users[loan_data['user_idx']]
        ebook = ebooks[loan_data['book_idx']]

        loan_date = datetime.utcnow() - timedelta(days=loan_data['days_ago'])
        due_date = loan_date + timedelta(days=14)

        loan = Loan(
            user_id=user.id,
            ebook_id=ebook.id,
            loan_date=loan_date,
            due_date=due_date,
            is_returned=False
        )
        db.session.add(loan)
        print(f"  ✓ Overdue: {user.username} borrowed '{ebook.title}'")

    # Create some returned loans
    returned_loans_data = [
        {'user_idx': 1, 'book_idx': 4, 'loan_days_ago': 30, 'return_days_ago': 17},
        {'user_idx': 2, 'book_idx': 7, 'loan_days_ago': 25, 'return_days_ago': 12},
        {'user_idx': 3, 'book_idx': 9, 'loan_days_ago': 40, 'return_days_ago': 28},
        {'user_idx': 4, 'book_idx': 10, 'loan_days_ago': 35, 'return_days_ago': 22},
    ]

    for loan_data in returned_loans_data:
        user = users[loan_data['user_idx']]
        ebook = ebooks[loan_data['book_idx']]

        loan_date = datetime.utcnow(
        ) - timedelta(days=loan_data['loan_days_ago'])
        due_date = loan_date + timedelta(days=14)
        return_date = datetime.utcnow(
        ) - timedelta(days=loan_data['return_days_ago'])

        loan = Loan(
            user_id=user.id,
            ebook_id=ebook.id,
            loan_date=loan_date,
            due_date=due_date,
            return_date=return_date,
            is_returned=True
        )
        db.session.add(loan)
        print(f"  ✓ Returned: {user.username} returned '{ebook.title}'")

    db.session.commit()


def main():
    """Main seeder function"""
    with app.app_context():
        print("=" * 60)
        print("E-LIBRARY DATABASE SEEDER")
        print("=" * 60)

        # Clear existing data
        clear_database()

        # Create admin user
        admin = create_admin_user()

        # Create regular users
        users = create_regular_users()

        # Create categories
        categories = create_categories()

        # Create ebooks
        ebooks = create_ebooks(categories)

        # Create loans
        create_loans(users, ebooks)

        print("\n" + "=" * 60)
        print("DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("\n📊 Summary:")
        print(f"  • Admin Users: 1")
        print(f"  • Regular Users: {len(users)}")
        print(f"  • Categories: {len(categories)}")
        print(f"  • Ebooks: {len(ebooks)}")
        print(f"  • Total Loans: {Loan.query.count()}")
        print(
            f"  • Active Loans: {Loan.query.filter_by(is_returned=False).count()}")
        print(
            f"  • Returned Loans: {Loan.query.filter_by(is_returned=True).count()}")

        print("\n🔐 Admin Credentials:")
        print("  Username: admin")
        print("  Email: admin@elib.com")
        print("  Password: Admin@123")

        print("\n👤 Regular User Credentials (all have password: User@123):")
        print("  • john_doe (john@example.com)")
        print("  • jane_smith (jane@example.com)")
        print("  • bob_wilson (bob@example.com)")
        print("  • alice_brown (alice@example.com)")
        print("  • charlie_davis (charlie@example.com)")

        print("\n✅ You can now login and access the admin dashboard!")
        print("=" * 60)


if __name__ == '__main__':
    main()
