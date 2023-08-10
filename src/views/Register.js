import './Register.css';
import { useRef, useState } from 'react'
import { Route, Routes, BrowserRouter, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import dniDatabase from '../data/dniDatabase.json';
import axios from 'axios';

const Register = () => {
    const userNameRef = useRef()
    const emailRef = useRef()
    const dniRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordref = useRef()
    const { register, checkIfDNIAlreadyExists } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e){
        e.preventDefault()

        const username = userNameRef.current.value;
        const email = emailRef.current.value;
        const dni = dniRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordref.current.value;
        /* VALIDATIONS */

        /* USERNAME */

        if (!username) {
            return setError('El usuario no puede estar vacio');
        }

        // Check if the username length is within the specified range
        if (username.length < 3 || username.length > 24) {
            return setError('El usuario debe tener entre 3 y 24 caracteres');
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(userNameRef.current.value)) {
            return setError('El nombre no debe tener caracteres especiales');
        }
        /* EMAIL */

        if (!email) {
            return setError('El Email no puede estar vacio');
        }

        /* DNI */

        if (!dni) {
            return setError('El DNI no puede estar vacio');
        }
        
        if (!dniDatabase.includes(dni)) {
            return setError('El DNI no existe');
        }

        /* PARA CHECKEAR */
        const dniAlreadyExists = await checkIfDNIAlreadyExists(dni);
        if (dniAlreadyExists) {
            return setError('El DNI ya está registrado');
        }

        /* PASSWORD */

        if (!password) {
            return setError('La contraseña no puede estar vacia');
        }

        if (passwordRef.current.value !== confirmPasswordref.current.value) {
            console.log("Error, contras distintas")
            return setError('Las contraseñas no son iguales')
        }

        if (passwordRef.current.value.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }


        /* IF EVERYTHING IS FINE: */
        try {
            setError('');
            setLoading(true);
            /*  */
            const response = await axios.post("http://localhost:8080/register", {
                email: email,
                userName:username,
                password:password,
                dni:dni
            });
            console.log("Register response:",response.status);
            if (response.status === 200) {
                /* Acomodar redirection, debe llevar al inicio */
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
            }
            
            return response
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('El email ya está en uso');
            } else {
                setError('Error al registrarse');
            }
            setLoading(false);
        }
    }

    return (
        <>
            <div className="logoHeader">
                <h1>Estaciona Chivilcoy</h1>
            </div>

            <div className="formContainer">
                <h2>Registrate</h2>
                <p>Puede crear una cuenta de forma gratuita!</p>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="userName">Usuario</label>
                    <input type="text" name="userName" id="userName" placeholder="Usuario" required ref={userNameRef}/>

                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" placeholder="Email" required ref={emailRef}/>

                    <label htmlFor="dni">DNI</label>
                    <input type="text" name="dni" id="dni" placeholder="DNI" required ref={dniRef}/>

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" id="password" placeholder="Contraseña" required ref={passwordRef}/>

                    <label htmlFor="confirmPass">Confirmar Contraseña</label>
                    <input type="password" name="confirmPass" id="confirmPass" placeholder="Confirmar Contraseña" required ref={confirmPasswordref}/>


                    <input type="submit" value="REGISTRAR" disabled={loading}/>
                    {error && <p id="error">{error}</p>}
                    <Link to="/login"><p>Ya tengo una cuenta</p></Link>


                </form>
            </div>
        </>
    );
}

export default Register;
