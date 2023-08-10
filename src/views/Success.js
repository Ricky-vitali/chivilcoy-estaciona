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
    const collectorId = queryParams.get('collection_id');

    useEffect(() => {
        const getOrderStatus = async () => {
            try {

                const YOUR_ACCESS_TOKEN = 'YOUR_MERCADOPAGO_ACCESS_TOKEN';

                // Construct the correct URL to fetch payment status
                const response = await fetch(`https://api.mercadopago.com/v1/payments/1314295784`, {
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

        getOrderStatus();
    }, [collectorId]);



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

