import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ViewImages from '../components/viewimages.js'; // New component for viewing images

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

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
              <strong>Room:</strong> {item.room}
              {' | '}
              <button onClick={() => handleViewImages(item.item_id)}>View Images</button>
            </li>
          ))}
        </ul>
      )}

      {/* Conditionally render the ViewImages component */}
      {selectedItemId && (
        <ViewImages itemId={selectedItemId} onClose={closeImages} />
      )}
    </div>
  );
};





export default InventoryList;
