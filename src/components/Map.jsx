import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Map = ({ businesses, center = [36.0726, -79.7920], zoom = 12 }) => {
  return (
    <MapContainer center={center} zoom={zoom} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {businesses.map((business) => {
        if (business.latitude && business.longitude) {
          return (
            <Marker
              key={business.id}
              position={[business.latitude, business.longitude]}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{business.name}</h3>
                  <p className="popup-category">{business.category}</p>
                  <p>{business.address}</p>
                  <p>{business.city}, {business.state}</p>
                  {business.phone && <p>📞 {business.phone}</p>}
                </div>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default Map;
