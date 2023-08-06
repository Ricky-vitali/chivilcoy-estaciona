import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";
import CustomButton from "./CustomButton";
import SectionTitle from "./SectionTitle";
import styles from "./AddCarModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'



const AddCarModal = (props) => {

    const [carName, setCarName] = useState("");
    const [carPlate, setCarPlate] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get the currently logged-in user
        const auth = getAuth();
        const currentUser = auth.currentUser;

        try {
            const response = await axios.post("https://estaciona-chivilcoy.onrender.com/createCar", {
                carName: carName,
                plate: carPlate,
                userId: currentUser.uid,
            });

            // Call onAddCar to update the cars state in the parent (Vehicles) component
            props.onAddCar(response.data);

            props.onClose();
            console.log(response.data);
            return response;
        } catch (error) {
            console.log(error);
        }

        // Reset the form fields
        setCarName("");
        setCarPlate("");
    };

/*     const handleSubmit = async (event) => {
        event.preventDefault();

        // Get the currently logged-in user
        const auth = getAuth();
        const currentUser = auth.currentUser;

        
        try {
            const response = await axios.post("https://estaciona-chivilcoy.onrender.com/createCar", {
                carName: carName,
                plate: carPlate,
                userId: currentUser.uid
            });

            props.onClose();
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }


        // Reset the form fields
        setCarName("");
        setCarPlate("");

        // Close the modal
    } */

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
                        <input type="text" name="carName" id="carName" placeholder="Nombre del Auto" value={carName} onChange={(e) => setCarName(e.target.value)} />

                        <label htmlFor="plate">Patente del Auto</label>
                        <input type="text" name="plate" id="plate" placeholder="Patente del Auto" value={carPlate} onChange={(e) => setCarPlate(e.target.value)} />

                        <input type="submit" value="Agregar Vehiculo" />
                        </form>
                    </div>
                    
                </div>
            
            </div>
        

    );
}

export default AddCarModal;
