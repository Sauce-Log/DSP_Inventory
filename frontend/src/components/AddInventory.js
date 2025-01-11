import React, { useState } from 'react';
import api from '../services/api';
import { predefinedNames, predefinedBuildings } from '../constants';

const AddInventory = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    room: '',
  });
  const [customName, setCustomName] = useState('');
  const [customBuilding, setCustomBuilding] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNameChange = (value) => {
    if (value === 'custom') {
      setFormData({ ...formData, name: 'custom' });
      setCustomName('');
    } else {
      setFormData({ ...formData, name: value });
    }
  };
  
  const handleBuildingChange = (value) => {
    if (value === 'custom') {
      setFormData({ ...formData, building: 'custom' });
      setCustomBuilding('');
    } else {
      setFormData({ ...formData, building: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSubmit = {
      ...formData,
      name: formData.name === 'custom' ? customName : formData.name, /* Check for custom inputs when submitting data */
      building: formData.building === 'custom' ? customBuilding : formData.building,
    };
  
    try {
      await api.post('/inventory', dataToSubmit);
      onAdd();
      setFormData({ name: '', building: '', room: '' });
      setCustomName('');
      setCustomBuilding('');
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-dark">
      <h3 className="mb-3 text-center">Add New Inventory Item</h3>

    {/* Name */}
      <label className="form-label">
        Name:
        <select
          className="form-select form-select-sm mb-2"
          value={formData.name || 'choose'}
          onChange={(e) => handleNameChange(e.target.value)}
        >
          <option value="choose" disabled hidden>
            Choose here
          </option>
          {predefinedNames.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="custom">Other</option>
        </select>
        {formData.name === 'custom' && (
          <input
            className="form-control"
            type="text"
            placeholder="Enter custom item"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
          />
        )}
      </label>
  
      {/* Building Field */}
      <label className="form-label">
        Building:
        <select
          className="form-select form-select-sm mb-2"
          value={formData.building || 'choose'}
          onChange={(e) => handleBuildingChange(e.target.value)}
        >
          <option value="choose" disabled hidden>
            Choose here
          </option>
          {predefinedBuildings.map(building => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
          <option value="custom">Other</option>

        </select>
        {formData.building === 'custom' && (
          <input
            className="form-control"
            type="text"
            placeholder="Enter custom building"
            value={customBuilding}
            onChange={(e) => setCustomBuilding(e.target.value)}
            required
          />
        )}
      </label>
  
      {/* Room Field */}
      <label className="form-label">
        Room:
        <input
          className="form-control mb-3"
          type="text"
          name="room"
          placeholder="Room"
          value={formData.room}
          onChange={handleChange}
          required
        />
      </label>
  
      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100">
        Add Item
      </button>
    </form>
  );
};

export default AddInventory;
