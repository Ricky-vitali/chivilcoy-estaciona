import './Login.css';
import { useRef, useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginAttempts, setLoginAttempts] = useState(() => {
        const storedAttempts = localStorage.getItem('loginAttempts');
        return storedAttempts ? parseInt(storedAttempts) : 0;
    });
    const maxLoginAttempts = 3;
    const resetDelay = 60 * 1000; 
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);

            // Increment login attempts
            setLoginAttempts((prevAttempts) => prevAttempts + 1);
            localStorage.setItem('loginAttempts', (loginAttempts + 1).toString());

            if (loginAttempts >= maxLoginAttempts) {
                const nextLoginTime = new Date().getTime() + resetDelay;
                localStorage.setItem('nextLoginTime', nextLoginTime.toString());
                const remainingTime = Math.ceil(resetDelay / 1000);
                setError(`Llegaste al máximo intento de logeos. Inténtalo nuevamente después de ${remainingTime} segundos.`);
                setLoading(false);
                return;
            }

            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        } catch {
            setError('Error al ingresar');
        }

        setLoading(false);
    }

    useEffect(() => {
        localStorage.setItem('loginAttempts', loginAttempts.toString());
    }, [loginAttempts]);

    useEffect(() => {
        const nextLoginTimeStr = localStorage.getItem('nextLoginTime');
        const nextLoginTime = parseInt(nextLoginTimeStr);
        if (!isNaN(nextLoginTime)) {
            const currentTime = new Date().getTime();
            if (nextLoginTime > currentTime) {
                const remainingTime = Math.ceil((nextLoginTime - currentTime) / 1000);
                setError(`Llegaste al máximo intento de logeos. Inténtalo nuevamente después de ${remainingTime} segundos.`);
                setTimeout(() => {
                    setError('');
                    setLoginAttempts(0);
                    localStorage.removeItem('nextLoginTime');
                    localStorage.setItem('loginAttempts', '0');
                }, resetDelay);
            } else {
                setError('');
                setLoginAttempts(0);
                localStorage.removeItem('nextLoginTime');
                localStorage.setItem('loginAttempts', '0');
            }
        }
    }, []);

    return (
        <>
            <div className="logoHeader">
                <h1>Estaciona Chivilcoy</h1>
            </div>

            <div className="formContainer">
                <h2>Iniciar Sesión</h2>
                <p>Ingrese en su cuenta para comenzar a estacionar!</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="userName">Email</label>
                    <input type="text" name="email" id="email" placeholder="Email" ref={emailRef} required/>

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" id="password" placeholder="Contraseña" ref={passwordRef} required/>

                    <input type="submit" value="INGRESAR" />
                    {error && <p id="error">{error}</p>}
                    <Link to="/register">
                        <p>No tienes cuenta ?</p>
                    </Link>
                </form>
            </div>
        </>
    );
}

export default Login;