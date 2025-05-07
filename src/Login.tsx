import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // React Router hook for navigation

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if the entered username and password match the placeholders
        if (username === 'tralalelo' && password === '12345') {
            navigate('/inventory'); // Redirect to App.tsx
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-header">
                    <h2>Login</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            // Add placeholder
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                             // Add placeholder
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="show-password"
                            checked={showPassword}
                            onChange={() => setShowPassword((prev) => !prev)}
                        />
                        <label htmlFor="show-password">Show Password</label>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
