import { Route, Routes, BrowserRouter, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import ConfirmAction from './ConfirmAction';
import { useState } from "react";

const LogoutButton = () => {

    const navigate = useNavigate();
    const [confirmModal, setConfirmModal] = useState(false)
    const { currentUser, logout } = useAuth()

    async function handleLogOut() {
        try {
            await logout();
            navigate("/login");
        } catch {
            console.log("Error al deslogear");
        }
    }

    const handleConfirmLogout = async () => {
        await handleLogOut();
        setConfirmModal(false);
    };

    const handleCancel = async () => {
        setConfirmModal(false)
    }

    return (
        <>
            <li onClick={() => setConfirmModal(true)}><FontAwesomeIcon icon={faRightFromBracket} /> Cerrar Sesión</li>
            {confirmModal && <ConfirmAction confirmText={"Cerrar Sesión"} text={"¿Estas seguro que quieres cerrar sesión?"} onConfirm={handleConfirmLogout} onCancel={handleCancel} />}
        </>
    );
}

export default LogoutButton;
