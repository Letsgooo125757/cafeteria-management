import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(''); // Clear error message on input change
        setSuccessMessage(''); // Clear success message on input change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, username: formData.username, password: formData.password })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message || `Error: ${response.status}`);
                return;
            }

            setSuccessMessage('Registration successful! You can now log in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Registration fetch error:', err);
            setError('An error occurred while registering. Please try again later.');
        }
    }

    return (
        <div className="registration-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="back-to-login-link">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}

export default RegistrationPage;