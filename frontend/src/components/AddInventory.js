import React, { useState } from 'react';
import api from '../services/api';

const AddInventory = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    room: '',
  });
  const [customName, setCustomName] = useState('');
  const [customBuilding, setCustomBuilding] = useState('');

  const predefinedNames = ['Adjustable Desk', 'Chair', 'Table', 'Whiteboard'];
  const predefinedBuildings = ['Social Sciences', 'Engineering', 'Library'];

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNameChange = value => {
    if (value === 'custom') {
      setFormData({ ...formData, name: '' });
    } else {
      setFormData({ ...formData, name: value });
    }
  };

  const handleBuildingChange = value => {
    if (value === 'custom') {
      setFormData({ ...formData, building: '' });
    } else {
      setFormData({ ...formData, building: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const finalData = {
      ...formData,
      name: formData.name || customName,
      building: formData.building || customBuilding,
    };
    try {
      await api.post('/inventory', finalData);
      onAdd();
      setFormData({ name: '', building: '', room: '' });
      setCustomName('');
      setCustomBuilding('');
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Inventory Item</h3>
      <label>
        Name:
        <select
          value={predefinedNames.includes(formData.name) ? formData.name : 'custom'}
          onChange={e => handleNameChange(e.target.value)}
        >
          {predefinedNames.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="custom">Other</option>
        </select>
        {!predefinedNames.includes(formData.name) && (
          <input
            type="text"
            placeholder="Enter custom name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            required
          />
        )}
      </label>

      <label>
        Building:
        <select
          value={predefinedBuildings.includes(formData.building) ? formData.building : 'custom'}
          onChange={e => handleBuildingChange(e.target.value)}
        >
          {predefinedBuildings.map(building => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
          <option value="custom">Other</option>
        </select>
        {!predefinedBuildings.includes(formData.building) && (
          <input
            type="text"
            placeholder="Enter custom building"
            value={customBuilding}
            onChange={e => setCustomBuilding(e.target.value)}
            required
          />
        )}
      </label>

      <label>
        Room:
        <input
          type="text"
          name="room"
          placeholder="Room"
          value={formData.room}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddInventory;
