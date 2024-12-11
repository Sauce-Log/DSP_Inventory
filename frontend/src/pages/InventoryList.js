import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ViewImages from '../components/viewimages.js';
import AddImageModal from '../components/AddImageModal.js';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmingItem, setConfirmingItem] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle View Images
  const handleViewImages = (itemId) => {
    setSelectedItemId(itemId);
  };

  const closeImages = () => {
    setSelectedItemId(null);
  };

  // Handle Add Image
  const openAddImageModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowAddImageModal(true);
  };

  const closeAddImageModal = () => {
    setShowAddImageModal(false);
    setSelectedItemId(null);
  };

  // Handle Edit Item
  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/inventory/${editingItem.item_id}`, {
        name: editingItem.name,
        building: editingItem.building,
        room: editingItem.room,
      });
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  // Handle Remove Item
  const handleRemove = async () => {
    if (password === '510520') {
      try {
        await api.delete(`/inventory/${confirmingItem.item_id}`);
        setConfirmingItem(null);
        setPassword('');
        fetchInventory();
      } catch (error) {
        console.error('Error removing item:', error);
      }
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <div>
      <h2>Inventory Items</h2>
      {items.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.item_id}>
              <strong>ID:</strong> {item.item_id} | 
              <strong>Name:</strong> {item.name} | 
              <strong>Building:</strong> {item.building} | 
              <strong>Room:</strong> {item.room} |
              <strong>Last Updated:</strong> {formatDate(item.last_updated)}
              {' | '}
              <button onClick={() => handleViewImages(item.item_id)}>View Images</button>
              {' '}
              <button onClick={() => openAddImageModal(item.item_id)}>Add Image</button>
              {' '}
              <button onClick={() => handleEdit(item)}>Edit</button>
              {' '}
              <button onClick={() => setConfirmingItem(item)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      {/* View Images Modal */}
      {selectedItemId && !showAddImageModal && (
        <ViewImages itemId={selectedItemId} onClose={closeImages} />
      )}

      {/* Add Image Modal */}
      {showAddImageModal && (
        <AddImageModal itemId={selectedItemId} onClose={closeAddImageModal} />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Edit Item</h3>
            <label>
              Name: 
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
            </label>
            <label>
              Building: 
              <input
                type="text"
                value={editingItem.building}
                onChange={(e) => setEditingItem({ ...editingItem, building: e.target.value })}
              />
            </label>
            <label>
              Room: 
              <input
                type="text"
                value={editingItem.room}
                onChange={(e) => setEditingItem({ ...editingItem, room: e.target.value })}
              />
            </label>
            <button onClick={saveEdit}>Save</button>
            <button onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {confirmingItem && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Confirm Removal</h3>
            <p>Enter password to delete this item:</p>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRemove}>Confirm</button>
            <button onClick={() => setConfirmingItem(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Styles
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '400px',
    position: 'relative',
  },
};

export default InventoryList;
