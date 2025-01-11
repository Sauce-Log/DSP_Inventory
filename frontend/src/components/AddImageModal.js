import React, { useState } from 'react';
import api from '../services/api';

const AddImageModal = ({ itemId, onClose }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAddImage = async () => {
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post(`/inventory/${itemId}/images/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(`Image uploaded successfully to item ${itemId}`);
            onClose();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h3>Upload Image for Item ID: {itemId}</h3>
                <button className="btn btn-danger" onClick={onClose} style={modalStyles.closeButton}>Close</button>
                <div>
                    <input
                        class="form-control"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ margin: '10px 0' }}
                    />
                    <button onClick={handleAddImage} style={modalStyles.addButton}>
                        Upload Image
                    </button>
                </div>
            </div>
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
    modal: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '400px',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default AddImageModal;
