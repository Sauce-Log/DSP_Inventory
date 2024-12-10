from app import app, db

# Activate the application context
with app.app_context():
    # Drop all tables
    db.drop_all()

    # Recreate all tables
    db.create_all()
    print("Database reset successfully!")