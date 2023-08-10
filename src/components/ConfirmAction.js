import SectionTitle from "../components/SectionTitle";
import styles from "./ConfirmAction.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ConfirmAction = (props) => {

    const handleConfirm = () => {
        props.onConfirm();
    };

    const handleCancel = () => {
        props.onCancel();
    };

    return (
        <>
            <div className="darkBackground">

                <div className="modalConfirmContainer">
                    <div className="modalTitle">
                        <FontAwesomeIcon icon={faArrowLeft} onClick={handleCancel} />
                        <h3>{props.text}</h3>
                    </div>
                    <hr />
                    <div className="modalButtonsContainer">
                        <div className="modalButtons">
                            <button className="cancelButton" onClick={handleCancel}>Cancelar</button>
                            <button className="confirmButton" onClick={handleConfirm}>{props.confirmText}</button>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ConfirmAction;

