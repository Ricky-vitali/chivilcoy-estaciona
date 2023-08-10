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
    
    console.log("Success query params:",queryParams)


    useEffect(() => {
        const getOrderStatus = async (collectorId) => {
            try {
                const YOUR_ACCESS_TOKEN = 'TEST-2039711323530302-072700-102a314cf2e5d98a9a91f5c25c49f643-1102603889'; // Replace this with your MercadoPago access token
                console.log(`Bearer ${YOUR_ACCESS_TOKEN}`,"Collector id:",collectorId);
                /* https://www.mercadopago.com.ar/developers/es/reference/payments/_payments_id/get */
                const response = await fetch(`https://api.mercadopago.com/v1/payments/${collectorId}`, {
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
        getOrderStatus()
    }, [currentUser.uid]);

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
