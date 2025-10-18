from datetime import datetime, timedelta
from models import Loan, User, Ebook, db
from utils.email_service import notify_loan_deadline


def check_and_notify(days_before_deadline: int = 2):
    """
    Parcourt les prêts non encore retournés et envoie un mail
    de rappel `days_before_deadline` jours avant la date limite.
    (Supposons que la durée standard soit 14 jours, ajustable.)
    """
    deadline = datetime.utcnow() + timedelta(days=days_before_deadline)
    loans = (db.session.query(Loan, User, Ebook)
             .join(User, User.id == Loan.user_id)
             .join(Ebook, Ebook.id == Loan.ebook_id)
             .filter(Loan.return_date.is_(None),
                     Loan.loan_date + timedelta(days=14) <= deadline)
             .all())

    for loan, user, ebook in loans:
        notify_loan_deadline(user.email, ebook.title, days_before_deadline)
        print(f"[INFO] Rappel envoyé à {user.email} pour '{ebook.title}' "
              f"(échéance dans {days_before_deadline} jours)")



if __name__ == "__main__":
    check_and_notify(days_before_deadline=2)