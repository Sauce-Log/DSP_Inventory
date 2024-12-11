import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ViewImages from '../components/viewimages.js'; // Component for viewing images
import AddImageModal from '../components/AddImageModal.js'; // New component for adding images

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      console.log('Fetched inventory:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleViewImages = (itemId) => {
    setSelectedItemId(itemId);
  };

  const closeImages = () => {
    setSelectedItemId(null);
  };

  const openAddImageModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowAddImageModal(true);
  };

  const closeAddImageModal = () => {
    setShowAddImageModal(false);
    setSelectedItemId(null);
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


  return (
    <div>
      <h2>Inventory Items</h2>
      {items.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <ul>
          {items.map(item => (
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
            </li>
          ))}
        </ul>
      )}

      {/* Conditionally render the ViewImages component */}
      {selectedItemId && !showAddImageModal && (
        <ViewImages itemId={selectedItemId} onClose={closeImages} />
      )}

      {/* Conditionally render the AddImageModal component */}
      {showAddImageModal && (
        <AddImageModal itemId={selectedItemId} onClose={closeAddImageModal} />
      )}
    </div>
  );
};

export default InventoryList;
