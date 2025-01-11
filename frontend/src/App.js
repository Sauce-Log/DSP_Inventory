import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InventoryList from './pages/InventoryList';
import AddInventory from './components/AddInventory';
import './styles.css';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  const handleAdd = () => {
    // Refresh inventory list after adding
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <h1 className='header'>Inventory Management</h1>
        <AddInventory onAdd={handleAdd} />
        <Routes>
          <Route path="/" element={<InventoryList />} />
          {/* Add more routes here*/}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
