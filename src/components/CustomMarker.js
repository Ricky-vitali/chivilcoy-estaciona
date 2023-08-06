import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon, Icon } from '@react-google-maps/api';

const CustomMarker = ({ position, icon }) => {
    const markerStyle = {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '50px',
        height: '50px',
        backgroundImage: `url(${icon})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div style={markerStyle}>
            <Marker position={position} icon={null} />
        </div>
    );
};

export default CustomMarker;
