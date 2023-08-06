
import { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectCarCard from "./SelectCarCard";
import { useAuth } from '../contexts/AuthContext';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios'
import LoadingCircle from "./LoadingCircle";
import styles from './ParkingModal.css'

const ParkingModal = ( props, onFormSubmit ) => {
    const [carsData, setCarsData] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState(null);
    const [selectedCarPlate, setSelectedCarPlate] = useState(null);
    const [parkingTimes, setParkingTimes] = useState({}); // Store parking time for each car
    const [loading, setLoading] = useState(true);
    const [preferenceId, setPreferenceId] = useState(null);
    const { currentUser } = useAuth();

    initMercadoPago('TEST-5baae833-7718-43e6-8882-b51ba5bf2111');

    const createPreference = async () => {
        try {
            const response = await axios.post("https://estaciona-chivilcoy.onrender.com/create_preference", {
                description: `Estacionar ${selectedCarPlate} por ${parkingTimes[selectedCarId]} Minutos`,
                price: 2 * parkingTimes[selectedCarId],
                quantity: 1,
                userId: currentUser.uid
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            setPreferenceId(id);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/getUserData/${currentUser.uid}`);

                console.log("Get cars:", response.data);
                setCarsData(response.data);
                setLoading(false)
                return response
                // Handle the response data as needed, e.g., set it to state or perform other operations.
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid]);


    const handleCarSelect = (selectedCar) => {
        handleBuy()  
        console.log("Click", selectedCar)

        setSelectedCarId(selectedCar.carId);
        setSelectedCarPlate(selectedCar.carPlate)
        setParkingTimes((prevParkingTimes) => ({
            ...prevParkingTimes,
            [selectedCar.carId]: prevParkingTimes[selectedCar.carId] || "", // Set the parking time for the selected car or an empty string if it's not set yet
        }));
    };

    const handleTimeChange = (carId, time) => {
        // Update the parkingTimes state with the parking time for the corresponding car
        setParkingTimes((prevParkingTimes) => ({
            ...prevParkingTimes,
            [carId]: time,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                console.log(userCoords,parkingTimes);
                try {
                    const response = await axios.post("https://estaciona-chivilcoy.onrender.com/parkCar", {
                        coordinates: userCoords,
                        carId: selectedCarId,
                        userId: currentUser.uid, 
                        time: parkingTimes[selectedCarId],
                        plate: selectedCarPlate
                        
                    });


                    console.log(response);
                  /*   props.onClose(); */
                } catch (error) {
                    console.log(error);
                }
                
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        console.log(selectedCarId, "Time", parkingTimes[selectedCarId]);
    }; 

    return (
        <div className="darkBackground">
            <div className="modalContainer">
                <div className="modalTitle">
                    <FontAwesomeIcon icon={faArrowLeft} onClick={props.onClose} />
                    <h3>Seleccione su Vehiculo</h3>
                </div>
                <hr />
                {loading ? (
                    
                  <LoadingCircle/>
                ) : (
                    <>
                        <div className="modalForm">
                            <form  onSubmit={handleSubmit} >
                                <div className="selectableCarsContainer">
                                {carsData.map((car) => {
                                    const isCarParked = car.isParked === true;
                                    return (
                                        <SelectCarCard
                                            key={car.id}
                                            car={car}
                                            onSelect={handleCarSelect}
                                            isSelected={selectedCarId === car.id}
                                            parkingTime={parkingTimes[car.id] || ""}
                                            setParkingTime={(time) => handleTimeChange(car.id, time)}
                                            disabled={isCarParked}
                                        />
                                    );
                                })}
                                </div>
                        
                                    <button onClick={handleBuy}>Estacionar</button>
                            </form>
                        {/*         <button onClick={handleBuy}>Estacionar</button> */}
                                {preferenceId && <Wallet initialization={{ preferenceId }} />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default ParkingModal;


