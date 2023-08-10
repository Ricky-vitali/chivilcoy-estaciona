import styles from './VehicleCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react'
import AddTimeModal from './AddTimeModal';
import AddTimeIcon from "../assets/timeAdd.svg"
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';



const VehicleCard = ({ car, onDeleteCar, disableDelete, onAddTimeNotification, onShowCar }) => {
    const [displayDetails, setDisplayDetails] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(null)
    const { currentUser } = useAuth();


    const handleAddTimeNotification = (message) => {
        setNotificationMessage(message);
        onAddTimeNotification(message);
    };


    const handleOpenModal = () => {
        setShowModal(true);
    };

    const carStatusStyle = {
        color: car.isParked ? '#5BB14C'/* Green */ : 'red',
        display: 'flex', 
        flexDirection: 'column', 
    };

    return (
        <>
        <div className="vehicleCard">
            <div>

                <div>
                    <FontAwesomeIcon icon={faCarSide} className="carIcon" />
                </div>
                <div>
                    <h3>{car.name}</h3>
                    <p>Patente: {car.plate}</p>
                </div>
            </div>

            <div className="secondContainer">

                    {!disableDelete &&
                <>
                    {car.isParked ? (
                        <p style={carStatusStyle}>
                            Estacionado <span>{car.expirationTime}</span>
                        </p>
                    ) : (
                        <p style={carStatusStyle}>No Estacionado</p>
                    )}
                    {car.isParked ? (
                        <img src={AddTimeIcon} alt="Add time icon" className="addTimeIcon" onClick={handleOpenModal} />
                    ) : (
                        ""
                    )}
                </>
                    }
                  <FontAwesomeIcon icon={faAngleDown} onClick={() => { setDisplayDetails(!displayDetails) }} />
            </div>

                {displayDetails &&
                
                    <div className='cardDetails'>
                        <div>
                            <p>Marca: {car.brand}</p>
                            <p>Modelo: {car.type}</p>
                            <p>Color: {car.color}</p>
                        </div>
                        {disableDelete ? (
                            <div>
                                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => onShowCar(car.coordinates)} />
                            </div>
                        ) : (
                            !car.isParked && (
                                <div className='cardDetailsTrash'>
                                    <FontAwesomeIcon icon={faTrash} onClick={() => onDeleteCar(car.id)} />
                                </div>
                            )
                        )}
                    </div>}
                
                

            </div>
            {showModal && <AddTimeModal onAddTimeNotification={handleAddTimeNotification} onClose={() => setShowModal(false)} car={car} />}
 


        </>
    );
}

export default VehicleCard;
