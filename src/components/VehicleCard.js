import styles from './VehicleCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react'
import AddTimeModal from './AddTimeModal';
import AddTimeIcon from "../assets/timeAdd.svg"
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';



const VehicleCard = ({ car, onDeleteCar, disableDelete }) => {
    const [displayDetails, setDisplayDetails] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [deleteButtonStatus, setDeleteButtonStatus] = useState(disableDelete);
    const { currentUser } = useAuth();
   
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
                    {!deleteButtonStatus ?  
                    <p style={carStatusStyle}>
                        {car.isParked ? (
                            <>
                                Estacionado <span>{car.expirationTime}</span>
                            </>
                        ) : (
                            'No Estacionado'
                        )}
                    </p>:("")}
                    {car.isParked ? <img src={AddTimeIcon} alt="Add time icon" className="addTimeIcon" onClick={handleOpenModal} />:""}
                <p onClick={() => { setDisplayDetails(!displayDetails) }} > {deleteButtonStatus ? "Ver Detalles":""} <FontAwesomeIcon icon={faAngleDown} /></p>
            </div>

                {displayDetails &&
                
                    <div className='cardDetails'>
                        <div>
                            <p>Marca: {car.brand}</p>
                            <p>Modelo: {car.type}</p>
                            <p>Color: {car.color}</p>
                        </div>
                        {deleteButtonStatus ? (
                            "") : (<div>
                                <FontAwesomeIcon icon={faTrash} onClick={() => onDeleteCar(car.id)} />
                            </div>)
                        }
                    </div>}
                
                {showModal && <AddTimeModal onClose={() => setShowModal(false)} car={car} />}

        </div>

 


        </>
    );
}

export default VehicleCard;
