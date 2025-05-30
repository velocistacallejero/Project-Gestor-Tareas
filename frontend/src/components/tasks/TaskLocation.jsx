import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const TaskLocation = ({ taskId, initialLocation }) => {
  const [location, setLocation] = useState(initialLocation || null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(
    initialLocation || { lat: 4.5709, lng: -74.2973 } // Default to Bogotá
  );

  const handleMapClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setLocation(newLocation);
    setCenter(newLocation);
    saveLocation(newLocation);
  };

  const saveLocation = async (loc) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/location`, {
        location: loc
      });
    } catch (err) {
      console.error('Error saving location:', err);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Ubicación de la Tarea</h3>
      <LoadScript googleMapsApiKey="TU_API_KEY_DE_GOOGLE_MAPS">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={location ? 15 : 10}
          onClick={handleMapClick}
          onLoad={(map) => setMap(map)}
        >
          {location && (
            <Marker
              position={location}
            />
          )}
        </GoogleMap>
      </LoadScript>
      {location && (
        <p className="mt-2 text-sm text-gray-600">
          Ubicación seleccionada: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
        </p>
      )}
      {!location && (
        <p className="mt-2 text-sm text-gray-600">
          Haz clic en el mapa para seleccionar una ubicación para esta tarea
        </p>
      )}
    </div>
  );
};

export default TaskLocation;