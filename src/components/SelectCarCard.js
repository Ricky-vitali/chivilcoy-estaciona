import { useState } from 'react';
import styles from './SelectCarCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide } from '@fortawesome/free-solid-svg-icons';

const SelectCarCard = ({ car, onSelect, isSelected, disabled, setParkingTime, parkingTime }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        if (!disabled) {
            onSelect({ carId: car.id, carPlate: car.plate },);
        }
    };

    return (
        <div
            className={`selectVehicleCard ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={handleCheckboxChange}
        >
            <div>
                <FontAwesomeIcon icon={faCarSide} className="carIcon" />
            </div>
            <div>
                <h3>{car.name}</h3>
                <p>Patente: {car.plate}</p>
            </div>
            <div className="timeContainer">
                <label htmlFor={`carCheckbox-${car.id}`}>Select</label>
                <input
                    type="checkbox"
                    id={`carCheckbox-${car.id}`}
                    name={`carCheckbox-${car.id}`}
                    value={ { carId: car.id, carPlate: car.plate }}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    disabled={disabled}
                />

                <label htmlFor={`time-${car.id}`} className="timeLabel"> Minutos</label>
                <input
                    type="number"
                    id={`time-${car.id}`}
                    name={`time-${car.id}`}
                    min="1"
                    max="60"
                    value={parkingTime}
                    onChange={(e) => setParkingTime(e.target.value)}
                    disabled={disabled}
                    placeholder='30 mins'
                />
            </div>
            {disabled && <p className="parkedText">Ya está estacionado</p>}
        </div>
    );
};

export default SelectCarCard;




