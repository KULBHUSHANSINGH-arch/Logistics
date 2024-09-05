import React, { useState, useEffect } from 'react';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../ContextAPI';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const [employId, setEmployId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setToken } = useContext(AppContext);
    const [url, setUrl] = useState("");

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const employeeId = localStorage.getItem("CurrentUser");
        const url = localStorage.getItem('url');
        setUrl(url);

        if (token && employeeId) {
            setEmployId('');
        }

    }, []);

    const notifySuccess = (message) => toast.success(message, { autoClose: 1000 });
    const notifyError = (message) => toast.error(message, { autoClose: 1000 });

    const validateInput = () => {
        if (!employId || !password) {
            setError('Employ ID and Password are required.');
            return false;
        }
        setError('');
        return true;
    };

    const userlogin = async () => {
        if (!validateInput()) return;

        console.log("Login Id:", employId);
        console.log("Login Password:", password);

        const url = localStorage.getItem('url');

        try {
            const res = await axios.post(`${url}/api/user/login-account`, {
                employeeId: employId,
                password: password,
                department: 'Machine Maintenance'
            }, {
                headers: {
                    'ngrok-warning': 'skip true',
                }
            });

            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('CurrentUser', employId);
            console.log('chckingg...', res.data)

            navigate('/dashboard');
            notifySuccess('Login successful!');

        } catch (error) {
            console.log("Error:", error);
            notifyError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-SignUP form-SignIN-card" style={{ marginTop: '143px' }}>
            <form onSubmit={(event) => event.preventDefault()} >
                <h1>Sign in</h1>

                <input
                    type="text"
                    placeholder="Employ ID"
                    name="employId"
                    value={employId}
                    onChange={(e) => setEmployId(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    // onChange={handleChange}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" onClick={userlogin} className="Signup-btn" >Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;