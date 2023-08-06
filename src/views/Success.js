import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDatabase, ref, onValue, off, update, push } from "firebase/database";
import SectionTitle from "../components/SectionTitle";
import SuccessIcon from "../components/SuccessIcon";
import { useAuth } from '../contexts/AuthContext';

const Success = () => {
    const [carsData, setCarsData] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedCarId = queryParams.get("carId");
    const parkingTime = queryParams.get("parkingTime");
    const { currentUser } = useAuth();


    useEffect(() => {
        // Fetch the cars data from Firebase Realtime Database
        const databaseRef = ref(getDatabase(), `users/${currentUser.uid}/cars`);
        const unsubscribe = onValue(databaseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the object of cars into an array
                const carsArray = Object.entries(data).map(([id, car]) => ({
                    id,
                    ...car,
                }));
                setCarsData(carsArray);
            }
        });

        // Clean up the database listener on component unmount
        return () => {
            // Detach the listener
            off(databaseRef, unsubscribe);
        };
    }, [currentUser.uid]);

    useEffect(() => {
        const updateParkingData = (carId, time) => {
            if (!carId || !time) return;

            // Get the current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const coordinates = { lat: latitude, lng: longitude };

                        const currentTime = new Date();
                        const expirationTime = new Date(currentTime.getTime() + time * 60000);

                        // Get a reference to the parked car in the database
                        const parkedCarRef = ref(getDatabase(), `users/${currentUser.uid}/cars/${carId}`);

                        // Update the isParked value and push the parked car data to the 'parkedCars' collection
                        update(parkedCarRef, { isParked: true })
                            .then(() => {
                                // Create a new parked car object
                                const parkedCarData = {
                                    carId,
                                    userId: currentUser.uid,
                                    name: carsData.find((car) => car.id === carId).name,
                                    plate: carsData.find((car) => car.id === carId).plate,
                                    type: carsData.find((car) => car.id === carId).type,
                                    expirationTime: expirationTime.toString(),
                                    coordinates: `${coordinates.lat}, ${coordinates.lng}`,
                                };

                                // Push the parked car data to the 'parkedCars' collection
                                const parkedCarsRef = push(ref(getDatabase(), `parkedCars`));
                                return update(parkedCarsRef, parkedCarData);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        };

        // If the context values are available, proceed with updating the Firebase data
        if (selectedCarId && parkingTime) {
            updateParkingData(selectedCarId, parkingTime);
        }
    }, [currentUser.uid, carsData, selectedCarId, parkingTime]);


    return (
        <>
            <div className="parkingContainer">
                <SectionTitle sectionName={'Exito'} />
            </div>
            <SuccessIcon />
        </>
    );
};

export default Success;
