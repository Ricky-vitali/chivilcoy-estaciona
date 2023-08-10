import axios from 'axios';
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SectionTitle from "../components/SectionTitle"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import styles from "./Profile.css"
import ConfirmAction from '../components/ConfirmAction';

const Profile = () => {
    const { currentUser } = useAuth();
    const newPasswordRef = useRef()
    const confirmPasswordref = useRef()
    const [error, setError] = useState('')
    const [confirmModal, setConfirmModal] = useState(false)
    const [userToDeleteId, setUserToDeleteId] = useState(null);
    const navigate = useNavigate();


    console.log("Profile:", currentUser)
    const handleChangePassword = async (e) => {
        e.preventDefault()

        const newPassword = newPasswordRef.current.value;

        if (newPasswordRef.current.value !== confirmPasswordref.current.value) {
            console.log("Error, contras distintas")
            return setError('Las contraseñas no son iguales')
        }

        try {
            const response = await axios.post("http://localhost:8080/changePassword", {
                userId: currentUser.uid, 
                newPassword: newPassword
            });
            console.log("Register response:", response);
            

            return response
        } catch (error) {
            console.log(error);
        }
    }

    const handleConfirmDelete = async () => {

        console.log("Confirm to delete user id:",userToDeleteId)

        try {
            const response = await axios.delete(`http://localhost:8080/deleteUser/${userToDeleteId}`, {
   
            });
            console.log("Delete my account response:", response);
            navigate('/login');

            return response
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (e) => {
        
        setUserToDeleteId(currentUser.uid)
        setConfirmModal(true)
        
    }


    const handleCancel = async () => {
        setUserToDeleteId(null)
        setConfirmModal(false)
    }

    return (
        <>
            <div className="profileContainer">
                <SectionTitle sectionName={'Mi Perfil'} />
                <div className="dataContainer">
                    <div className="dataPlacerHolder">
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faFaceSmile} /> Usuario:</p>
                            <p>Usu23</p>
                        </div>
                        <div className="dataRow">
                        <p><FontAwesomeIcon icon={faUser} /> Nombre:</p>
                            <p>Rickys</p>
                        </div>
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faEnvelope} /> Email:</p>
                            <p>Nombre.Apellido.Bien.Largo@gmail</p>
                        </div>
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faIdCard} /> DNI</p>
                            <p>404040</p>
                        </div>
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faCakeCandles} /> Cumpleaños:</p>
                            <p>28 de agost</p>
                        </div>
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faFlag} /> Nacionalidad</p>
                            <p>Rusia</p>
                        </div>
                        <div className="dataRow">
                            <p><FontAwesomeIcon icon={faVenusMars} /> Sexo:</p>
                            <p>M</p>
                        </div>
                    </div>

                </div>
                <form onSubmit={handleChangePassword}>
                    <button>Cambiar Contraseña</button>

                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <input type="password" name="newPassword" id="newPassword" placeholder="Contraseña" required ref={newPasswordRef} />

                    <label htmlFor="confirmPass">Confirmar Contraseña</label>
                    <input type="password" name="confirmNewPass" id="confirmNewPass" placeholder="Confirmar Contraseña" required ref={confirmPasswordref} />
                    {error && <p id="error">{error}</p>}
                   
                </form>
                <button className="confirmButton" onClick={handleDelete}>Eliminar Cuenta</button>
                {confirmModal && <ConfirmAction confirmText={"Eliminar cuenta"} text={"¿Estas seguro que quieres eliminar tu cuenta?"} onConfirm={handleConfirmDelete} onCancel={handleCancel} /> }
            </div>

        </>


    );
}

export default Profile;
