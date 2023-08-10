
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
    const [errorMessage, setErrorMessage] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const { currentUser } = useAuth();
    /*    notification_url: "https://webhook.site/9db91ceb-070f-4712-bb9d-81e45f99cc1e", */
    initMercadoPago('TEST-5baae833-7718-43e6-8882-b51ba5bf2111');

    const createPreference = async () => {
        try {
            const YOUR_ACCESS_TOKEN = 'TEST-2039711323530302-072700-102a314cf2e5d98a9a91f5c25c49f643-1102603889'; // Replace this with your MercadoPago access token

            const preferenceData = {
                    items: [
                        {
                            title: `Estacionar ${selectedCarPlate} por ${parkingTimes[selectedCarId]} Minutos`,
                            description: `Estacionar ${selectedCarPlate} por ${parkingTimes[selectedCarId]} Minutos`,
                            category_id: "3333",
                            quantity: 1,
                            currency_id: "ARS",
                            unit_price: 2 * parkingTimes[selectedCarId], 
                        },
                    ],  
                back_urls: {
                    success: "https://chivilcoy-estaciona.onrender.com/",
                    pending: "https://chivilcoy-estaciona.onrender.com/"
                },
                external_reference: `${currentUser.uid}`,
           
                notification_url: "http://localhost:8080/webhook/mercadopago",
            };

            const response = await axios.post("https://api.mercadopago.com/checkout/preferences", preferenceData, {
                headers: {
                    Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            })

         
            
            console.log ("responseee:",response.data.collector_id) 
            return response.data.collector_id;
        } catch (error) {
            console.log(error);
        }
    };

    

    const getOrderStatus = async () => {
        try {
            const YOUR_ACCESS_TOKEN = 'TEST-2039711323530302-072700-102a314cf2e5d98a9a91f5c25c49f643-1102603889'; // Replace this with your MercadoPago access token
            console.log(`Bearer ${YOUR_ACCESS_TOKEN}`);
            /* https://www.mercadopago.com.ar/developers/es/reference/payments/_payments_id/get */
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${preferenceId}`, {
                headers: {
                    Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("Order response:", data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }; 
/*    const getOrderStatus = async () => {
    
       try {
            const YOUR_ACCESS_TOKEN = 'TEST-2039711323530302-072700-102a314cf2e5d98a9a91f5c25c49f643-1102603889'; // Replace this with your MercadoPago access token
            console.log(`Bearer ${YOUR_ACCESS_TOKEN}`)
            const response = await axios.get(`https://api.mercadopago.com/merchant_orders/10912306260`, {
                headers: {
                    Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
                },
            });
            
            console.log("Order reponse:",response)
            return response.data;
        } catch (error) {
            console.log(error);
        } 
    };  */

    
/*    const getOrderStatus = async () => {
       try {
           const YOUR_ACCESS_TOKEN = 'TEST-2039711323530302-072700-102a314cf2e5d98a9a91f5c25c49f643-1102603889';
           const response = await axios.get(`https://estaciona-chivilcoy.onrender.comgetOrderStatus/${currentUser.uid}/${YOUR_ACCESS_TOKEN}`, {

           });
           console.log(response);
           return response
          
       } catch (error) {
           console.log(error);
       }
    }; 

 */
/*     const createPreference = async () => {
        try {
            const response = await axios.post("https://estaciona-chivilcoy.onrender.comcreate_preference", {
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
    }; */


     const handleBuy = async (e) => {
        e.preventDefault();
        const id = await createPreference();
        console.log("Handlebuy:", id)
        if (id) {
            setPreferenceId(id);
            const orderStatus = await getOrderStatus();
            console.log("Order in handle buy:", orderStatus) 
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://estaciona-chivilcoy.onrender.com/getUserCars/${currentUser.uid}`);

                console.log("Get cars:", response.data);
                setCarsData(response.data);
                setLoading(false)
                return response
             
            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        };

        fetchData();
    }, [currentUser.uid]);


    const handleCarSelect = (selectedCar) => {
       
        console.log("Click", selectedCar)

        setSelectedCarId(selectedCar.carId);
        setSelectedCarPlate(selectedCar.carPlate)
        setParkingTimes((prevParkingTimes) => ({
            ...prevParkingTimes,
            [selectedCar.carId]: prevParkingTimes[selectedCar.carId] || "", // Set the parking time for the selected car or an empty string if it's not set yet
        }));
        setErrorMessage("");

    };

    const handleTimeChange = (carId, time) => {
        // Update the parkingTimes state with the parking time for the corresponding car
        setParkingTimes((prevParkingTimes) => ({
            ...prevParkingTimes,
            [carId]: time,
        }));
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedCarId || !parkingTimes[selectedCarId]) {
            setErrorMessage("Por favor, seleccione un vehículo y el tiempo de estacionamiento.");
            return; 
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                console.log(userCoords,parkingTimes);
                try {
                    const response = await axios.post("https://estaciona-chivilcoy.onrender.comparkCar", {
                        coordinates: userCoords,
                        carId: selectedCarId,
                        userId: currentUser.uid, 
                        time: parkingTimes[selectedCarId],
                        plate: selectedCarPlate
                        
                    });


                    console.log("Al estacionar", response.status);
    
                    if (response.status === 200) {
                        props.onGetNotification(response.data.message);
                        props.onClose();
                    } else {
                        setErrorMessage(response.data.message); // Set the error message from the response
                    }
                } catch (error) {
                    console.log(error);
                    setErrorMessage("Se produjo un error al procesar su solicitud."); // Set a default error message for network errors
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
                            <form onSubmit={handleBuy}  >
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
                                    {errorMessage  && <p className="formMessage"> {errorMessage} </p>}
                                    <button>Estacionar</button>
                                    
                                    
                                    
                            </form>
                            
                                {preferenceId && <Wallet initialization={{ preferenceId }} />} 
                        </div>
                           
                    </>
                )}
            </div>
        </div>
    );
};
export default ParkingModal;


