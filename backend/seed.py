from app import app, db
from models import Inventory, Image

with app.app_context():
    desk = Inventory(name='Desk', building='Social Sciences', room='136')
    db.session.add(desk)
    db.session.commit()

    image = Image(item_id=desk.item_id, image_url='backend/static/images/136_social_sciences.jpg')
    db.session.add(image)
    db.session.commit()