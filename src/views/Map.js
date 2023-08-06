import './Map.css';
import { useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Parking from './Parking';
import Support from './Support';
import Vehicles from './Vehicles';
import Success from './Success';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';
import CarMarker from "../assets/carLocation.svg"
import MyLocation from "../assets/myLocation.svg"
import OfficerLocation from "../assets/officerLocation.svg"
import CustomAlert from "../components/CustomAlert";
import firebase from 'firebase/compat/app'; // Import compat mode for Firebase app
import 'firebase/compat/firestore'; // Import compat mode for Firestore
import 'firebase/compat/database';
import axios from 'axios';
import AllVehicles from './AllVehicles';
import Profile from './Profile';


const Map = () => {
    const { currentUser } = useAuth();
    const [carMarkers, setCarMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isOfficer, setIsOfficer] = useState(false);
    const [userCoordinates, setUserCoordinates] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

/*     console.log(currentUser) */
    
/*     const boundaryCoords = [
        { lat: -34.884723, lng: -60.019455 },
        { lat: -34.897191, lng: -60.033421 },
        { lat: -34.908861, lng: -60.018655 },
        { lat: -34.896498, lng: -60.004622 },
    ];  */

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
            // Create a reference to the user's document in the Firebase Realtime Database
            const userRef = ref(getDatabase(), `users/${currentUser.uid}`);

            // Attach a listener to the reference to read the data when it changes
            const unsubscribe = onValue(userRef, (snapshot) => {
                // Get the value of isOfficer from the snapshot
                const userData = snapshot.val();
                const isOfficerValue = userData?.isOfficer || false;
                console.log("Im an officer:",isOfficerValue);

                setIsOfficer(isOfficerValue);
            });

            // Clean up the listener when the component unmounts
            return () => {
                // Detach the listener when the component unmounts
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/parkedCars/${currentUser.uid}/${isOfficer}`);

                console.log("Get cars from map:", response.data);
           
                setCarMarkers(response.data);
                // Handle the response data as needed, e.g., set it to state or perform other operations.
             
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

/*     useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        const dbRef = firebase.database().ref(`/parkedCars/`);

        const handleDataChange = (snapshot) => {
            const data = snapshot.val();
            setCarMarkers(Object.values(data));
        };

        dbRef.on('value', handleDataChange);

        return () => {
            // Unsubscribe from the listener when the component unmounts
            dbRef.off('value', handleDataChange);
        };
    }, []); */
    

    const handleMarkerClick = (marker, car) => {
        setSelectedMarker(marker);
        setSelectedCar(car);
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
                <GoogleMap mapContainerClassName="googleMap" options={mapOptions}>

                    {carMarkers.map((carMarker, index) => {
   
                        const car = carMarkers[index].car;

                            return (
                                <Marker
                                    icon={{
                                        url: CarMarker,
                                    }}
                                    key={index}
                                    position={carMarker.coordinates} 
                                    onClick={() => handleMarkerClick(carMarker, car)}
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

                    {selectedMarker && selectedCar && (isOfficer || selectedCar.userId === currentUser.uid) && (
                        <InfoWindow
                            position={selectedMarker}
                            onCloseClick={() => {
                                setSelectedMarker(null);
                                setSelectedCar(null);
                            }}
                        >
                            <div>
                                <h4>Nombre: {selectedCar.name}</h4>
                                <p>Patente: {selectedCar.plate}</p>
                                <p>Marca: {selectedCar.type}</p>
                                <p>Expiración: {formatExpirationTime(selectedCar.expirationTime)}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
     
         
            <section className="sectionContainer">
                {showAlert && <CustomAlert message={alertMessage} />}
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/parking" />} 
                      
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/parking" element={isOfficer ? <AllVehicles /> : <Parking />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/success" element={<Success />} />
                </Routes>
            </section>
        </>
    );
};

export default Map;
