import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import './Login.css';

function LoginPage({onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear previous error message

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        // Dummy login credentials - for demo purposes
        const dummyCredentials = [
            { username: 'admin', password: 'admin123', role: 'admin', id: 1, name: 'Administrator' },
            { username: 'user', password: 'user123', role: 'customer', id: 2, name: 'Regular User' },
            { username: 'staff', password: 'staff123', role: 'staff', id: 3, name: 'Staff Member' },
            { username: 'demo', password: 'demo', role: 'customer', id: 4, name: 'Demo User' }
        ];

        // Get registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Combine dummy credentials with registered users for authentication
        const allValidUsers = [
            ...dummyCredentials,
            ...registeredUsers.map(user => ({
                username: user.username,
                password: user.password,
                role: user.role,
                id: user.id,
                name: user.name,
                email: user.email
            }))
        ];

        // Find matching credentials (check both username and email for registered users)
        const validUser = allValidUsers.find(user => {
            // For dummy users, only check username
            if (dummyCredentials.some(dummy => dummy.id === user.id)) {
                return user.username === username && user.password === password;
            }
            // For registered users, check both username and email
            return (user.username === username || user.email === username) && user.password === password;
        });

        if (validUser) {
            // Simulate successful login
            const dummyToken = `token-${validUser.id}-${Date.now()}`;
            const userData = {
                id: validUser.id,
                username: validUser.username,
                name: validUser.name,
                role: validUser.role,
                email: validUser.email || ''
            };

            localStorage.setItem('token', dummyToken); // Store the token
            localStorage.setItem('currentUser', JSON.stringify(userData)); // Store user data
            onLogin(userData); // Call the onLogin function passed as a prop
            navigate('/menu');
        } else {
            setError('Invalid username/email or password. You can register a new account or use demo credentials.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            
            {/* Demo credentials info */}
            <div className="demo-credentials">
                <h3>🔑 Demo Credentials</h3>
                <div className="credential-list">
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>User:</strong> user / user123</p>
                    <p><strong>Staff:</strong> staff / staff123</p>
                    <p><strong>Demo:</strong> demo / demo</p>
                </div>
                <p style={{textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#666'}}>
                    Or register a new account below!
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username or Email:</label>
                    <input
                    type="text"
                    id="username"
                    placeholder="Enter username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="forgot-password-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
}

export default LoginPage;
