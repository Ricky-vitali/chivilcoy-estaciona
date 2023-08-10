import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, update, push, get } from "firebase/database";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectCarCard from "./SelectCarCard";
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";
import styles from "./AddTimeModal.css"


const AddTimeModal = (props) => {

    console.log("Time modal:",props.car.id)


    const [additionalTime, setAdditionalTime] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!additionalTime.trim()) {
            setErrorMessage("Por favor, ingrese el tiempo en minutos a agregar."); 
            return; 
        }

        try {
            const response = await axios.post(`http://localhost:8080/addTime/${props.car.id}/${additionalTime}`, {
                carId: props.car.id,
                time: additionalTime

            });
           
            props.onClose();
            console.log(response.data)
            // Call the onAddTimeNotification callback with the response message
            props.onAddTimeNotification(response.data);
            return response
        } catch (error) {
            console.log(error);
            setErrorMessage("Se produjo un error al procesar su solicitud.");
            
        }

    };

    return (
        <>
            <div className="darkBackground">
                <div className="modalAddTimeContainer">
                    <div className="modalTitle">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={props.onClose} />
                        <h3>Agregar Tiempo</h3>
                    </div>
                    <hr />
                    <div className="modalForm">
                       <form onSubmit={handleSubmit}>
                            <label htmlFor={`time-${props.car.id}`}>Tiempo en minutos</label>
                            <input
                                className="addTimeInput"
                                type="number"
                                id={`time-${props.car.id}`}
                                name={`time-${props.car.id}`}
                                min="1"
                                max="60"
                                value={additionalTime}
                                onChange={(e) => setAdditionalTime(e.target.value)}
                                placeholder="Tiempo en minutos"
                            />
                            {errorMessage && <p className="formMessage"> {errorMessage} </p>}
                            <input type="submit" value="Agregar Tiempo" />
                        </form> 
                    </div>
                </div>
            </div>

        </>
    );
}

export default AddTimeModal;
