from extensions import db
from datetime import datetime
import pytz

class Inventory(db.Model):
    __tablename__ = 'inventory'
    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    building = db.Column(db.String(255), nullable=False)
    room = db.Column(db.String(255), nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.now)

    images = db.relationship('Image', backref='inventory', cascade="all, delete-orphan")
    requests = db.relationship('Request', backref='inventory', cascade="all, delete-orphan")

class Image(db.Model):
    __tablename__ = 'images'
    image_id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('inventory.item_id', ondelete='CASCADE'))
    image_url = db.Column(db.Text, nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Request(db.Model):
    __tablename__ = 'requests'
    request_id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('inventory.item_id', ondelete='SET NULL'))
    requester = db.Column(db.String(255), nullable=False)
    request_type = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), default='Pending')
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    fulfilled_at = db.Column(db.DateTime, nullable=True)