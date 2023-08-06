import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off, update, push, get } from "firebase/database";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectCarCard from "./SelectCarCard";
import { useAuth } from '../contexts/AuthContext';


const AddTimeModal = (props) => {


    const [additionalTime, setAdditionalTime] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();

        const database = getDatabase();
        const parkedCarsRef = ref(database, "parkedCars");

        const additionalTimeInMinutes = parseInt(additionalTime);

        // Retrieve the current parked cars
        get(parkedCarsRef)
            .then((snapshot) => {
                const parkedCarsData = snapshot.val();

                // Find the parked car with the matching carId
                const parkedCar = Object.values(parkedCarsData).find(
                    (car) => car.carId === props.car.id
                );

                if (parkedCar) {
                    // Calculate the new expiration time by adding the additional time
                    const expirationTime = new Date(parkedCar.expirationTime);
                    expirationTime.setMinutes(
                        expirationTime.getMinutes() + additionalTimeInMinutes
                    );

                    // Convert the new expiration time to a string in the desired format
                    const formattedExpirationTime = expirationTime.toString();

                    // Update the expirationTime value in the database
                    const parkedCarId = Object.keys(parkedCarsData).find(
                        (key) => parkedCarsData[key].carId === props.car.id
                    );
                    const parkedCarToUpdateRef = ref(
                        database,
                        `parkedCars/${parkedCarId}`
                    );
                    update(parkedCarToUpdateRef, {
                        expirationTime: formattedExpirationTime,
                    })
                        .then(() => {
                            // Reset the additionalTime input field
                            setAdditionalTime("");
                            // Close the modal
                            props.onClose();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /* THIS WORKS */
  /*   const handleSubmit = (e) => {
        e.preventDefault();

        const database = getDatabase();
        const parkedCarsRef = ref(database, 'parkedCars');
        const additionalTimeInMinutes = parseInt(additionalTime);

        get(parkedCarsRef)
            .then((snapshot) => {
                const parkedCars = snapshot.val();
                const carId = props.car.id;

                // Iterate through the parked cars to find the one with the matching carId
                for (const parkedCarKey in parkedCars) {
                    if (parkedCars.hasOwnProperty(parkedCarKey)) {
                        const parkedCar = parkedCars[parkedCarKey];

                        if (parkedCar.carId === carId) {
                            const parkedCarRef = ref(database, `parkedCars/${parkedCarKey}`);

                            // Retrieve the current parked car data
                            get(parkedCarRef)
                                .then((snapshot) => {
                                    const parkedCarData = snapshot.val();
                                    console.log(parkedCarData);

                                    // Calculate the new expiration time by adding the additional time
                                    const expirationTime = new Date(parkedCarData.expirationTime);
                                    expirationTime.setMinutes(expirationTime.getMinutes() + additionalTimeInMinutes);

                                    // Convert the new expiration time to a string in the desired format
                                    const formattedExpirationTime = expirationTime.toString();

                                    // Update the expirationTime value in the database
                                    update(parkedCarRef, { expirationTime: formattedExpirationTime })
                                        .then(() => {
                                            // Reset the additionalTime input field
                                            setAdditionalTime("");
                                            // Close the modal
                                            props.onClose();
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                            break;
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
 */

    return (
        <>
            <div className="darkBackground">
                <div className="modalContainer">
                    <div className="modalTitle">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={props.onClose} />
                        <h3>Agregar Tiempo</h3>
                    </div>
                    <hr />
                    <div className="modalForm">
                       <form onSubmit={handleSubmit}>
                            <label htmlFor={`time-${props.car.id}`}>Tiempo en minutos</label>
                            <input
                                type="number"
                                id={`time-${props.car.id}`}
                                name={`time-${props.car.id}`}
                                min="1"
                                max="60"
                                value={additionalTime}
                                onChange={(e) => setAdditionalTime(e.target.value)}
                            />
                            <input type="submit" value="Agregar Tiempo" />
                        </form> 
                    </div>
                </div>
            </div>

        </>
    );
}

export default AddTimeModal;
