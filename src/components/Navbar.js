import './Navbar.css';
import LogoutButton from './LogoutButton';
import { BrowserRouter as Router, Route, NavLink, Redirect, Outlet, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
/* import { faGear } from '@fortawesome/free-solid-svg-icons'; */
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faSquareParking } from '@fortawesome/free-solid-svg-icons';



const Navbar = (props) => {

    const { currentUser } = useAuth();

    return(
        <>
            <input type="checkbox" id="check" />
            <label for="check" class="checkbuton">
            <span class="icon-navicon"><FontAwesomeIcon icon={faBars} /></span>
            </label>
        <nav className="nav">
            <div className="darkBackground">
                <div className="navContainer">
                    <div className="userDataContainer">
                        <h2><span>User:</span> {currentUser.email}</h2>
                    </div>
                    <hr/>
                    <ul>
                            {props.isOfficer ? (                       
                            <>
                                <li>
                                    <NavLink to="/parking"><FontAwesomeIcon icon={faSquareParking} /> Vehiculos Estacionados</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/support"><FontAwesomeIcon icon={faHeadset} /> Soporte</NavLink>
                                </li>
                                <LogoutButton />
                            </>) : (                       
                                <>
                                <li>
                                    <NavLink to="/parking"><FontAwesomeIcon icon={faSquareParking} /> Estacionar</NavLink>
                                </li>
                                
                                <li>
                                    <NavLink to="/vehicles"><FontAwesomeIcon icon={faCar} /> Mis Vehiculos</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/profile"><FontAwesomeIcon icon={faUser} /> Mi Perfil</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/support"><FontAwesomeIcon icon={faHeadset} /> Soporte</NavLink>
                                </li>
                                    <LogoutButton />
                                </>
                                    )}
                    </ul>
                </div>
            </div>
        </nav>
        
        </>
    )
};

export default Navbar