import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";
import SectionTitle from "./SectionTitle";
import styles from "./AddCarModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'



const AddCarModal = (props) => {

    const [carName, setCarName] = useState("");
    const [carPlate, setCarPlate] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!carName.trim() || !carPlate.trim()) {
            setErrorMessage("Por favor, complete todos los campos."); // Set the error message if any of the inputs are empty
            return; 
        }

        // Get the currently logged-in user
        const auth = getAuth();
        const currentUser = auth.currentUser;

        try {
            const response = await axios.post("https://estaciona-chivilcoy.onrender.com/createCar", {
                carName: carName,
                plate: carPlate,
                userId: currentUser.uid,
            });

           
            props.onAddCar(response.data);
            props.onGetNotification(response.data.message);
            props.onClose();
            console.log("Add car response:",response.data);
            return response;
        } catch (error) {
         
            setErrorMessage(error.response.data.message); 
        }

        setCarName("");
        setCarPlate("");
    };


    return (
      
            <div className="darkBackground">
                
                <div className="modalContainer">
                    <div className="modalTitle">
                    <FontAwesomeIcon icon={faArrowLeft} onClick={props.onClose} />
                        <h3>Detalles del Vehiculo</h3>
                        
                    </div>
                    <hr />
                    <div className="modalForm">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="carName">Nombre del Auto</label>
                        <input type="text" name="carName" id="carName" placeholder="Nombre del Auto" value={carName} onChange={(e) => setCarName(e.target.value) } />

                        <label htmlFor="plate">Patente del Auto</label>
                        <input type="text" name="plate" id="plate" placeholder="Patente del Auto" value={carPlate} onChange={(e) =>  setCarPlate(e.target.value)  } />
                        {errorMessage && <p className="formMessage"> {errorMessage} </p>}
                        <input type="submit" value="Agregar Vehiculo" />
                        </form>
                    </div>
                    
                </div>
            
            </div>
        

    );
}

export default AddCarModal;
