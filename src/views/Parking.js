/* import CustomButton from "../components/CustomButton"; */
import SectionTitle from "../components/SectionTitle";
import { useState, useEffect } from "react";
import styles from './Parking.css'
import ParkingModal from "../components/ParkingModal";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useAuth } from '../contexts/AuthContext';

const Parking = ({ onFormSubmit }) => {
    const [showModal, setShowModal] = useState(false);
    const [hasCars, setHasCars] = useState(true); // Initialize with true
    const [canPark, setCanPark] = useState(true); // Initialize with true
    const { currentUser } = useAuth();


    useEffect(() => {
        // Check if the user has any cars
        const databaseRef = ref(getDatabase(), `users/${currentUser.uid}/cars`);
        const unsubscribe = onValue(databaseRef, (snapshot) => {
            const data = snapshot.val();
            setHasCars(!!data); // Set hasCars based on whether data exists
        });

        // Clean up the database listener on component unmount
        return () => {
            // Detach the listener
            off(databaseRef, unsubscribe);
        };
    }, [currentUser.uid]);

    const handleOpenModal = () => {
        // Check if the user's location falls within the boundary coordinates
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const canPark = checkIfWithinBoundary(userCoords);
                setCanPark(canPark);
                setShowModal(canPark);
            }, handleLocationError);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const checkIfWithinBoundary = (coords) => {
        /* Real Ones */
/*         const boundaryCoords = [
            { lat: -34.892756, lng: -60.019193 },
            { lat: -34.896971, lng: -60.024013 },
            { lat: -34.900966, lng: -60.018871 },
            { lat: -34.896793, lng: -60.014116 },
        ];


        /* Testing */

        const boundaryCoords = [
            { lat: -34.924947, lng: -60.017977 },
            { lat: -34.897743, lng: -60.053255 },
            { lat: -34.868743, lng: -60.019978 },
            { lat: -34.895986, lng: -59.985002 },
        ];

      // Check if the user's coordinates fall within the boundary coordinates
        // You can use any suitable library or algorithm to perform the point-in-polygon check
        // Here's a basic implementation using the Google Maps Geometry library
        const polygon = new window.google.maps.Polygon({
            paths: boundaryCoords,
        });
        return window.google.maps.geometry.poly.containsLocation(coords, polygon); 
    };

    const handleLocationError = (error) => {
        console.log(`Error retrieving location: ${error.message}`);
        setCanPark(false);
        setShowModal(false);
        
    };


    return (
        <>
            <div className="parkingContainer">
                <SectionTitle sectionName={'Estacionamiento'} />
                {hasCars && canPark && (
                    <button onClick={handleOpenModal}>Estacionar en Posición Actual</button>
                )}
                {hasCars && !canPark && <p>No puedes estacionar aquí. Estas fuera de la zona</p>}
                {!hasCars && <p>No tienes ningún vehículo. Ve a la seccion de Vehiculos</p>}
            </div>
            {showModal && <ParkingModal onClose={() => setShowModal(false)}  />}
        </>
    );
};

export default Parking;

