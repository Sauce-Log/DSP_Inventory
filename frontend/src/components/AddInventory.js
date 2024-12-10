import React, { useState } from 'react';
import api from '../services/api';

const AddInventory = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    room: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/inventory', formData);
      onAdd();
      setFormData({ name: '', building: '', room: '' });
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Inventory Item</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="building"
        placeholder="Building"
        value={formData.building}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="room"
        placeholder="Room"
        value={formData.room}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddInventory;
