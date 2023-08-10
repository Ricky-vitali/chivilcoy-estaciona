import './Map.css';
import { useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Parking from './Parking';
import Support from './Support';
import Vehicles from './Vehicles';
import Success from './Success';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';
import CarMarker from "../assets/carLocation.svg"
import MyLocation from "../assets/myLocation.svg"
import OfficerLocation from "../assets/officerLocation.svg"
import CustomAlert from "../components/CustomAlert";
import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore'; 
import 'firebase/compat/database';
import axios from 'axios';
import AllVehicles from './AllVehicles';
import Profile from './Profile';


const Map = ({}) => {
    const { currentUser } = useAuth();
    const [carMarkers, setCarMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isOfficer, setIsOfficer] = useState(false);
    const [userCoordinates, setUserCoordinates] = useState(null);
    const [isInside, setIsInside] = useState(null);
    const mapRef = useRef(null);
        
    console.log(currentUser)
/*     const boundaryCoords = [
        { lat: -34.884723, lng: -60.019455 },
        { lat: -34.897191, lng: -60.033421 },
        { lat: -34.908861, lng: -60.018655 },
        { lat: -34.896498, lng: -60.004622 },
    ];   */

    const boundaryCoords = [
        { lat: -34.924947, lng: -60.017977 },
        { lat: -34.897743, lng: -60.053255 },
        { lat: -34.868743, lng: -60.019978 },
        { lat: -34.895986, lng: -59.985002 },
    ]; 


/*       const boundaryCoords = [
        { lat: -34.892756, lng: -60.019193 },
        { lat: -34.896971, lng: -60.024013 },
        { lat: -34.900966, lng: -60.018871 },
        { lat: -34.896793, lng: -60.014116 },
    ];
 */
    useEffect(() => {
        // Check if the currentUser exists and is authenticated
        if (currentUser && currentUser.uid) {
            
            const userRef = ref(getDatabase(), `users/${currentUser.uid}`);

            const unsubscribe = onValue(userRef, (snapshot) => {
                // Get the value of isOfficer from the snapshot
                const userData = snapshot.val();
                const isOfficerValue = userData?.isOfficer || false;
                console.log("Im an officer:",isOfficerValue);

                setIsOfficer(isOfficerValue);
            });

            return () => {
                unsubscribe();
            };
        }
    }, [currentUser]);

    


    useEffect(() => {
        const MAX_ATTEMPTS = 3;
        let currentAttempt = 0;

        const getUserCoordinates = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoordinates({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.log('Error getting user coordinates:', error);
                    if (currentAttempt < MAX_ATTEMPTS) {
                        currentAttempt++;
                        setTimeout(getUserCoordinates, 1000);
                    }
                }
            );
        };

        getUserCoordinates();
    }, []); 

/*     useEffect(() => {


        const pointInPolygon = (point, polygon) => {
            const x = point.lng, y = point.lat;
            let inside = false;

            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i].lng, yi = polygon[i].lat;
                const xj = polygon[j].lng, yj = polygon[j].lat;

                const intersect = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

                if (intersect) {
                    inside = !inside;
                }
            }

            return inside;
        };

        const getUserCoordinates = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userCoordinates = { lat: latitude, lng: longitude };

                    if (pointInPolygon(userCoordinates, boundaryCoords)) {
                        console.log("You are inside");
                        
                    } else {
                        setIsInside("Estas fuera de la zona de estacionamiento.")
                    }
                },
                (error) => {
                    console.log('Error getting user coordinates:', error);

                }
            );
        };

        getUserCoordinates();
    }, []);
 */

    const handleGoToLocation = (coords) => {
        console.log("Map comp go to:", coords)
        if (mapRef.current) {

            const targetLocation = coords;
            const targetZoom = 17;

            mapRef.current.panTo(targetLocation);
            mapRef.current.setZoom(targetZoom);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/parkedCars/${currentUser.uid}/${isOfficer}`);

                console.log("Get cars from map:", response.data);
           
                setCarMarkers(response.data);
             
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid, isOfficer]);

    /* THE FOLLOWING CAN BE MODIFIED. MAYBE ITS NOT NECESARY. Check later */

    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        const dbRef = firebase.database().ref(`/parkedCars/`);

        const handleDataChange = (snapshot) => {
            const data = snapshot.val();
            let filteredCars = [];

            if (isOfficer) {
                // If the user is an officer, fetch all the cars from the database
                filteredCars = Object.values(data);
            } else if (currentUser) {
                // If the user is authenticated, fetch only their parked cars
                filteredCars = Object.values(data).filter((car) => car.userId === currentUser.uid);
            }

            setCarMarkers(filteredCars);
        };

        dbRef.on('value', handleDataChange);

        return () => {
            // Unsubscribe from the listener when the component unmounts
            dbRef.off('value', handleDataChange);
        };
    }, [currentUser, isOfficer]);

    
    const handleMarkerClick = (marker) => {
        console.log("Marker:",marker)
        setSelectedMarker(marker);
    };

    const mapOptions = {
        zoom: 17,
        center:  userCoordinates ,
       /*  
       center: { lat: -34.896912, lng: -60.019038 },, */
        mapId: 'a3d0227b2adbb388',
        disableDefaultUI: true,
    };

    const formatExpirationTime = (expirationTime) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };
        return new Date(expirationTime).toLocaleString(undefined, options);
    };



    return (
        <>
            <Navbar isOfficer={isOfficer} />
            <GoogleMap mapContainerClassName="googleMap" options={mapOptions} onLoad={(map) => {
                mapRef.current = map; 
            }}>

                    {carMarkers.map((carMarker, index) => {
  
                            return (
                                <Marker
                                    icon={{
                                        url: CarMarker,
                                    }}
                                    key={index}
                                    position={carMarker.coordinates} 
                                    onClick={() => handleMarkerClick(carMarker)}
                                />
                            );
 

                    })}

                    {userCoordinates && (
                        <>
                        <Marker
                            position={userCoordinates}
                            icon={{
                                url: isOfficer ? OfficerLocation : MyLocation,
                            }}
                        />
                        <Polygon
                        path={boundaryCoords}
                        options={{
                            strokeColor: '#FABF33',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            fillColor: '#03466B',
                            fillOpacity: 0.1,
                            clickable: true,
                        }}
                    />
                    </>
                    )}

                {selectedMarker && (isOfficer || selectedMarker.userId === currentUser.uid) && (
                        <InfoWindow
                        position={selectedMarker.coordinates}
                            onCloseClick={() => {
                                setSelectedMarker(null);
                            }}
                        >
                            <div>                 
                            <h4>Patente: {selectedMarker.plate}</h4>
                            <p><strong>Expiración: {selectedMarker.expirationTime}</strong></p>
                            <hr/>
                            <p>Marca: {selectedMarker.brand}</p>
                            <p>Modelo: {selectedMarker.type}</p>
                            <p>Color: {selectedMarker.color}</p>

                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
      
            <section className="sectionContainer">
                {isInside && <CustomAlert warning={true} notificationMessage={isInside} />} 
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/parking" />} 
                      
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/parking" element={isOfficer ? <AllVehicles OnGoToLocation={handleGoToLocation} /> : <Parking isNotInsideBounds={isInside} />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/success" element={<Success />} />
                </Routes>
            </section>
        </>
    );
};

export default Map;
