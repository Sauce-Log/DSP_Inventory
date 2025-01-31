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
    <div className="p-3 border rounded bg-dark">
      {/* Toggle Button */}
      <div class="col text-center">
      <button
        className="btn btn-lg btn-info mx-auto my-auto"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#addInventoryForm"
        aria-expanded="false"
        aria-controls="addInventoryForm"
      >
        Add New Inventory Item
      </button>
      </div>

      {/* Collapsible Form */}
      <div className="collapse" id="addInventoryForm">
        <div className="card card-body bg-dark text-white">
          <form onSubmit={handleSubmit}>
            <h3 className="mb-3 text-center">Add New Inventory Item</h3>

            {/* Name Field */}
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm bg-dark text-white"
                  value={formData.name || 'choose'}
                  onChange={(e) => handleNameChange(e.target.value)}
                >
                  <option value="choose" disabled hidden>
                    Choose here
                  </option>
                  {predefinedNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value="custom">Other</option>
                </select>
                {formData.name === 'custom' && (
                  <input
                    className="form-control bg-dark text-white"
                    type="text"
                    placeholder="Enter custom item"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {/* Building Field */}
            <div className="mb-3">
              <label className="form-label">Building:</label>
              <div className="input-group">
                <select
                  className="form-select form-select-sm bg-dark text-white"
                  value={formData.building || 'choose'}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                >
                  <option value="choose" disabled hidden>
                    Choose here
                  </option>
                  {predefinedBuildings.map((building) => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                  <option value="custom">Other</option>
                </select>
                {formData.building === 'custom' && (
                  <input
                    className="form-control bg-dark text-white"
                    type="text"
                    placeholder="Enter custom building"
                    value={customBuilding}
                    onChange={(e) => setCustomBuilding(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {/* Room Field */}
            <div className="mb-3">
              <label className="form-label">Room:</label>
              <div className="input-group">
                <input
                  className="form-control bg-dark text-white"
                  type="text"
                  name="room"
                  placeholder="Enter Room Number"
                  value={formData.room}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
