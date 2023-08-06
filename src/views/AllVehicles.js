import { useEffect, useState } from "react";
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
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';


const AllVehicles = () => {

    const [showModal, setshowModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [carToDeleteId, setCarToDeleteId] = useState(null);
    const [cars, setCars] = useState([]);
    const { currentUser } = useAuth();
    const [stateChange, setStateChange] = useState(false)
    const [loading, setLoading] = useState(true);
    const [isOfficer, setIsOfficer] = useState(false);

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
                console.log("Im an officer:", isOfficerValue);

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
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/parkedCars/${currentUser.uid}/${isOfficer}`);

                console.log("Get ALL cars officer:", response.data);
                setCars(response.data);
                setLoading(false)
                // Handle the response data as needed, e.g., set it to state or perform other operations.

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid, stateChange, isOfficer]);





    return (
        <>
            <div className="vehiclesContainer">
                <SectionTitle sectionName={'Vehiculos Estacionados'} />
                {loading ? (
                    <LoadingCircle />
                ) : (
                    cars.map((car) => (
                        <VehicleCard key={car.id} car={car} disableDelete={true} />
                    ))
                )}


            </div>
            {showModal && <AddCarModal onClose={() => setshowModal(false)} show={showModal} />}
        </>

    );
}

export default AllVehicles;
