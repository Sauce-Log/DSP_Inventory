import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ViewImages from '../components/viewimages.js';
import AddImageModal from '../components/AddImageModal.js';
import button from 'bootstrap/dist/css/bootstrap.min.css';
import { predefinedNames, predefinedBuildings } from '../constants';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmingItem, setConfirmingItem] = useState(null);
  const [password, setPassword] = useState('');
  const [filteredItems, setFilteredItems] = useState([]); // For displaying filtered results
  const [searchQuery, setSearchQuery] = useState(''); // For the search input
  const [selectedFilter, setSelectedFilter] = useState('all'); // Filter type: all, building, item, etc.


  const handleEditNameChange = (value) => {
    if (value === 'custom') {
      setEditingItem({ ...editingItem, name: 'custom', customName: '' });
    } else {
      setEditingItem({ ...editingItem, name: value, customName: undefined });
    }
  };
  
  const handleEditBuildingChange = (value) => {
    if (value === 'custom') {
      setEditingItem({ ...editingItem, building: 'custom', customBuilding: '' });
    } else {
      setEditingItem({ ...editingItem, building: value, customBuilding: undefined });
    }
  };
  

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [searchQuery, selectedFilter, items]);


  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      setItems(response.data);
      setFilteredItems(response.data);
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

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/inventory/${editingItem.item_id}`, {
        name: editingItem.name === 'custom' ? editingItem.customName : editingItem.name,
        building: editingItem.building === 'custom' ? editingItem.customBuilding : editingItem.building,
        room: editingItem.room,
      });
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

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

  const applyFilter = () => {

    console.log("Search Query:", searchQuery);
    console.log("Selected Filter:", selectedFilter);

    if (!searchQuery) {
      console.log("No search query entered. Displaying all items.");
      setFilteredItems(items); // If no query, show all items
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = items.filter((item) => {
      switch (selectedFilter) {
        case 'name':
          return item.name.toLowerCase().includes(lowerCaseQuery);
        case 'building':
          return item.building.toLowerCase().includes(lowerCaseQuery);
        default:
          return (
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.building.toLowerCase().includes(lowerCaseQuery)
          );
      }
    });
    console.log("Filtered Items:", filtered);
    setFilteredItems(filtered);
  };


  return (
    <div className="container">
      <h2 className="mt-3 mb-4 text-center">Inventory Items</h2>

      <style>
    {`
      .bg-dark::placeholder {
        color: white;
        opacity: 1;
      }
    `}
  </style>

      <div className="mb-4">
        <div className="d-flex justify-content-center">
          <input
            type="text"
            className="form-control w-50 bg-dark text-white"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-select w-25 ms-2 bg-dark text-white"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">Filter By</option>
            <option value="name">Item Name</option>
            <option value="building">Building</option>
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center">No inventory items found.</p>
      ) : (
        <div className="row">
          {filteredItems.map((item) => (
            <div key={item.item_id} className="col-md-4 mb-4">
              <div className="card bg-dark text-white shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Item: {item.name}</h5>
                  <p className="card-text">
                    <strong>ID:</strong> {item.item_id} <br />
                    <strong>Building:</strong> {item.building} <br />
                    <strong>Room:</strong> {item.room} <br />
                    <strong>Last Updated:</strong> {formatDate(item.last_updated)}
                  </p>
                  <div className="btn-group btn-group-sm w-100" role="group" aria-label="Item Buttons">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleViewImages(item.item_id)}
                    >
                      View Images
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => openAddImageModal(item.item_id)}
                    >
                      Add Image
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setConfirmingItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    

      {selectedItemId && !showAddImageModal && (
        <ViewImages itemId={selectedItemId} onClose={closeImages} />
      )}

      {showAddImageModal && (
        <AddImageModal itemId={selectedItemId} onClose={closeAddImageModal} />
      )}

      {editingItem && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal} className="p-3 border rounded bg-dark">
            <h3 className="mb-3 text-center text-light">Edit Inventory Item</h3>

            {/* Name Field */}
            <label className="form-label text-light">
              Name:
              <select
                className="form-select form-select-sm mb-2"
                value={predefinedNames.includes(editingItem.name) ? editingItem.name : 'custom'}
                onChange={(e) => handleEditNameChange(e.target.value)}
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
              {editingItem.name === 'custom' && (
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter custom item"
                  value={editingItem.customName || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, customName: e.target.value })}
                  required
                />
              )}
            </label>

            {/* Building Field */}
            <label className="form-label text-light">
              Building:
              <select
                className="form-select form-select-sm mb-2"
                value={predefinedBuildings.includes(editingItem.building) ? editingItem.building : 'custom'}
                onChange={(e) => handleEditBuildingChange(e.target.value)}
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
              {editingItem.building === 'custom' && (
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter custom building"
                  value={editingItem.customBuilding || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, customBuilding: e.target.value })}
                  required
                />
              )}
            </label>


            {/* Room Field */}
            <label className="form-label text-light">
              Room:
              <input
                className="form-control mb-3"
                type="text"
                placeholder="Room"
                value={editingItem.room}
                onChange={(e) => setEditingItem({ ...editingItem, room: e.target.value })}
                required
              />
            </label>

            {/* Save and Cancel Buttons */}
            <button onClick={saveEdit} className="btn btn-primary w-100 mb-2">
              Save
            </button>
            <button onClick={() => setEditingItem(null)} className="btn btn-danger w-100">
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmingItem && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Confirm Removal</h3>
            <p>Enter password to delete this item:</p>
            <input
              type="password" class="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-success btn-sm mt-2" onClick={handleRemove} >Confirm</button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmingItem(null)} style={modalStyles.closeButton}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};  

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
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
},
  modal: {
    background: '#282828',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '400px',
    position: 'relative',
  },
};




export default InventoryList;
