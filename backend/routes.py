from app import app, db
from flask import request, jsonify
from models import Inventory, Image, Request

# Helper function to serialize Inventory objects
def inventory_to_dict(item):
    return {
        'item_id': item.item_id,
        'name': item.name,
        'building': item.building,
        'room': item.room,
        'last_updated': item.last_updated.isoformat()
    }

# Get all inventory items
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([inventory_to_dict(item) for item in items])

# Add a new inventory item
@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    data = request.get_json()
    new_item = Inventory(
        name=data['name'],
        building=data['building'],
        room=data['room']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item added successfully'}), 201

# Update an existing inventory item
@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
def update_inventory(item_id):
    data = request.get_json()
    item = Inventory.query.get_or_404(item_id)
    item.name = data.get('name', item.name)
    item.building = data.get('building', item.building)
    item.room = data.get('room', item.room)
    item.last_updated = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Item updated successfully'})

# Delete an inventory item
@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory(item_id):
    item = Inventory.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'})
