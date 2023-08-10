import styles from './CustomAlert.css'


const CustomAlert = (props) => {
console.log("Custom alert:", props.warning)
    return (
        <div className={`customAlert ${props.warning ? 'alertWarning' : ''}`}>
                <p>{props.notificationMessage} </p>
            </div>    

    );
};

export default CustomAlert;


