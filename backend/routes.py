from app import app, db
from flask import request, jsonify
from models import Inventory, Image, Request
from datetime import datetime
import os
from werkzeug.utils import secure_filename


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
    item.last_updated = datetime.now()
    db.session.commit()
    return jsonify({'message': 'Item updated successfully'})

# Delete an inventory item
@app.route('/api/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory(item_id):
    item = Inventory.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'})

# Get images for a specific inventory item
from flask import url_for

@app.route('/api/inventory/<int:item_id>/images', methods=['GET'])
def get_item_images(item_id):
    item = Inventory.query.get_or_404(item_id)
    images = Image.query.filter_by(item_id=item_id).all()

    # Return full URLs for the images
    image_list = [
        {"image_url": url_for('static', filename=image.image_url, _external=True)}
        for image in images
    ]
    return jsonify(image_list)

@app.route('/api/inventory/<int:item_id>/images', methods=['POST'])
def add_item_image(item_id):
    data = request.get_json()
    image_url = data.get('image_url')
    
    if not image_url:
        return jsonify({"error": "Image URL is required"}), 400

    # Check if the item exists
    item = Inventory.query.get_or_404(item_id)

    # Add the new image to the database
    new_image = Image(item_id=item_id, image_url=image_url)
    db.session.add(new_image)
    db.session.commit()

    return jsonify({"message": f"Image added to item {item_id} successfully"})


# Directory to store uploaded images
UPLOAD_FOLDER = 'static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/inventory/<int:item_id>/images/upload', methods=['POST'])
def upload_image(item_id):
    # Check if the item exists
    item = Inventory.query.get_or_404(item_id)

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # Save the file securely
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Save the file path to the database
        image_url = f"images/{filename}"
        new_image = Image(item_id=item_id, image_url=image_url)
        db.session.add(new_image)
        db.session.commit()

        return jsonify({"message": "Image uploaded successfully"}), 201
    else:
        return jsonify({"error": "File type not allowed"}), 400
