import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPasswordpage.css';

function ForgotPasswordpage () {
    const [email, setEmail] = useState(' ');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email.trim()) {
            alert('Please enter your email address!');
            return;
        }

        console.log('Password reset requested for:', email);
        alert('If an account with that email exists, a pssword reset link has been sent.');
        navigate('/login');
    };

    return (
        <div className="forgot-password-container">
            <h1>Forgot Password</h1>
            <p className="instructions">Enter the email address associated with your account, and we'll send you a link to reset your password. </p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            <div className="back-to-login-link">
                <p>Remembered your password? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}

export default ForgotPasswordpage;