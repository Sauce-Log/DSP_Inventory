// frontend/src/components/ViewImages.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ViewImages = ({ itemId, onClose }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [itemId]);

  const fetchImages = async () => {
    try {
      const response = await api.get(`/inventory/${itemId}/images`);
      console.log(`Fetched images for item ${itemId}:`, response.data);
      setImages(response.data);
    } catch (error) {
      console.error(`Error fetching images for item ${itemId}:`, error);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3>Images for Item ID: {itemId}</h3>
        <button onClick={onClose} style={modalStyles.closeButton}>Close</button>
        {images.length === 0 ? (
          <p>No images found for this item.</p>
        ) : (
          <div style={modalStyles.imageContainer}>
            {images.map((img, index) => (
              <img 
                key={index} 
                src={img.image_url}
                alt={`Item ${itemId} - ${index + 1}`} 
                style={modalStyles.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple inline styles for the modal
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
    maxWidth: '600px',
    position: 'relative',
    maxHeight: '80vh', // Prevent modal from exceeding viewport height
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  imageContainer: {
    maxHeight: '70vh', // Allow scrolling for images
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '20px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '200px', // Scale down large images
    objectFit: 'contain',
  },
};

export default ViewImages;
