import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/database";
import SectionTitle from "../components/SectionTitle";
import styles from './Vehicles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VehicleCard from "../components/VehicleCard";
import AddCarModal from "../components/AddCarModal";
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext';
import LoadingCircle from "../components/LoadingCircle"
import ConfirmAction from '../components/ConfirmAction';
import CustomAlert from "../components/CustomAlert";


const Vehicles = () => {

    const [showModal, setshowModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [carToDeleteId, setCarToDeleteId] = useState(null);
    const [cars, setCars] = useState([]);
    const { currentUser } = useAuth();
    const [stateChange, setStateChange] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [loading, setLoading] = useState(true);

/*      useEffect(() => {
        // Fetch the cars data from Firebase Realtime Database
        const fetchCarsData = async () => {
            try {
                const user = firebase.auth().currentUser;
                const userId = user ? user.uid : null;
                if (!userId) {
                    // Handle the case where the user is not authenticated
                    return;
                }

                const databaseRef = firebase.database().ref(`users/${userId}/cars`);
                const snapshot = await databaseRef.once("value");
                const carsData = snapshot.val();

                if (carsData) {
                    // Convert the object of cars into an array
                    const carsArray = Object.entries(carsData).map(([id, car]) => ({
                        id,
                        ...car,
                    }));

                    // Check if the car has an expirationTime in the parkedCars table
                    // If it does, update the expirationTime in the user's car data
                    const parkedCarsRef = firebase.database().ref("parkedCars");
                    const updatedCarsArray = await Promise.all(
                        carsArray.map(async (car) => {
                            const parkedCarSnapshot = await parkedCarsRef.child(car.id).once("value");
                            const parkedCarData = parkedCarSnapshot.val();
                            if (parkedCarData && parkedCarData.expirationTime) {
                                return { ...car, expirationTime: parkedCarData.expirationTime };
                            }
                            return car;
                        })
                    );

                    setCars(updatedCarsArray);
                 
                }
            } catch (error) {
                console.log("Error fetching cars data:", error);
            }
        };

        fetchCarsData();
    }, []);
 */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/getUserCars/${currentUser.uid}`);

                console.log("Get cars Vehicle section:", response.data);
                setCars(response.data);
                setLoading(false)
                return response
           
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid, stateChange]);

    


    const handleDeleteCar = async (carId) => {
        if (carId) {
            console.log(carId)
            setCarToDeleteId(carId)
            setConfirmModal(true)
        }

    };

    const handleCancel = async () => {
        setCarToDeleteId(null)
        setConfirmModal(false)
    }

    const handleConfirmDelete = async () => {
        try {
            // Perform the car deletion using axios
            const response = await axios.delete("https://estaciona-chivilcoy.onrender.com/deleteCar", {
                data: {
                    userId: currentUser.uid,
                    carId: carToDeleteId,
                },
            });
            
            // Update the cars state, filter the deleted car
            setCars((prevCars) => prevCars.filter((car) => car.id !== carToDeleteId));
            handleNotification(response.data.message)
            console.log("Borrando...",response.data.message)
        } catch (error) {
            console.log(error);
            handleNotification(error.response.data.message)
        } finally {
            // Close the confirm modal
            setConfirmModal(false);
        }
    };


    const handleAddCar = () => {
        setStateChange(!stateChange)
    };

    const handleNotification = (message) => {
        setNotificationMessage(message)
        setTimeout(() => {
            setNotificationMessage(null);
        }, 4000);
    }

    return (
        <>
            <div className="vehiclesContainer">
                <SectionTitle sectionName={'Vehiculos'} />
                {loading ? (
                    <LoadingCircle />
                ) : (
                    cars.map((car) => (
                        <VehicleCard key={car.id} car={car} onAddTimeNotification={handleNotification} onDeleteCar={handleDeleteCar}/>
                    ))
                )}

                <button onClick={() => setshowModal(true)}>Agregar Vehiculo</button>
            </div>
            {confirmModal && <ConfirmAction confirmText={"Eliminar Vehiculo"} text={"¿Estas seguro que quieres eliminar el vehiculo?"} onConfirm={handleConfirmDelete} onCancel={handleCancel} />}
            {showModal && <AddCarModal onGetNotification={handleNotification} onClose={() => setshowModal(false)} show={showModal} onAddCar={handleAddCar} />}
            {notificationMessage && <CustomAlert notificationMessage={notificationMessage} />}
        </>

    );
}

export default Vehicles;
