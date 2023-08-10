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
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';


const AllVehicles = (props) => {

    const [showModal, setshowModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [carToDeleteId, setCarToDeleteId] = useState(null);
    const [cars, setCars] = useState([]);
    const { currentUser } = useAuth();
    const [stateChange, setStateChange] = useState(false)
    const [loading, setLoading] = useState(true);
    const [isOfficer, setIsOfficer] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const userRef = ref(getDatabase(), `users/${currentUser.uid}`);

            // Attach a listener to the reference to read the data when it changes
            const unsubscribe = onValue(userRef, (snapshot) => {
                // Get the value of isOfficer from the snapshot
                const userData = snapshot.val();
                const isOfficerValue = userData?.isOfficer || false;
                console.log("Im an officer:", isOfficerValue);

                setIsOfficer(isOfficerValue);
            });

            return () => {
                unsubscribe();
            };
        }
    }, [currentUser]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/parkedCars/${currentUser.uid}/${isOfficer}`);

                console.log("Get ALL cars officer:", response.data);
                setCars(response.data);
                setLoading(false)
                

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid, stateChange, isOfficer]);




    useEffect(() => {
        const parkedCarsRef = ref(getDatabase(), "parkedCars");
        const parkedCarsListener = onValue(parkedCarsRef, async (snapshot) => {
            const updatedCars = [];

            snapshot.forEach((childSnapshot) => {
                const carData = childSnapshot.val();
                updatedCars.push(carData);
            });

            const db = getFirestore();
            const plateCollectionRef = collection(db, 'carPlate'); 

            const enhancedDataPromises = updatedCars.map(async (data) => {
                const plate = data.plate;
                if (typeof plate === "string" && plate.trim() !== "") {
                    const plateDocRef = doc(plateCollectionRef, plate);
                    const plateDoc = await getDoc(plateDocRef);
                    if (plateDoc.exists()) {
                        const plateData = plateDoc.data();
                        return { ...data, ...plateData };
                    }
                }
                return data;
            });

            const enhancedData = await Promise.all(enhancedDataPromises);

            setCars(enhancedData);
        });

        return () => {
            parkedCarsListener();
        };
    }, []);

    const handleShowCar = (coords) => {
        console.log("Handle show",coords);
        props.OnGoToLocation(coords)
    }


    return (
        <>
            <div className="vehiclesContainer">
                <SectionTitle sectionName={'Vehiculos Estacionados'} />
                {loading ? (
                    <LoadingCircle />
                ) : (
                    cars.map((car) => (
                        <VehicleCard key={car.id} car={car} onShowCar={handleShowCar} disableDelete={true} />
                    ))
                )}


            </div>
            {showModal && <AddCarModal onClose={() => setshowModal(false)} show={showModal} />}
        </>

    );
}

export default AllVehicles;
