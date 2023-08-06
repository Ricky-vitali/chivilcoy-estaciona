
import SectionTitle from "../components/SectionTitle"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import { faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import styles from "./Profile.css"

const Profile = () => {


    return (
        <>
            <div className="profileContainer">
                <SectionTitle sectionName={'Mi Perfil'} />
                <div className="dataContainer">
                    <div className="dataPlacerHolder">
                        <p><FontAwesomeIcon icon={faFaceSmile} /> Usuario:</p>
                        <p><FontAwesomeIcon icon={faUser} /> Nombre:</p>
                        <p><FontAwesomeIcon icon={faEnvelope} /> Email:</p>
                        <p><FontAwesomeIcon icon={faIdCard} /> DNI</p>
                        <p><FontAwesomeIcon icon={faCakeCandles} /> Cumpleaños:</p>
                        <p><FontAwesomeIcon icon={faFlag} /> Nacionalidad</p>
                        <p><FontAwesomeIcon icon={faVenusMars} /> Sexo:</p>
                    </div>
                    <div className="userData">
                        <p>Usu23</p>
                        <p>Rickys</p>
                        <p>a@a</p>
                        <p>4222</p>
                        <p>22320</p>
                        <p>Peru</p>
                        <p>M</p>
                    </div>
                </div>
                <button>Cambiar Contraseña</button>
                <button>Eliminar Cuenta</button>
            </div>

        </>


    );
}

export default Profile;
