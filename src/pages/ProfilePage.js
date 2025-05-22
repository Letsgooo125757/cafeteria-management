import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage({ onProfileUpdate, onLogout }) {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        phone: '',
        profilePictureUrl: ''
    });

    const [passwordData, setPasswordData] = useState ({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect (() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated. Please log in.');
                setIsLoading(false);
                if (onLogout) {
                    onLogout();
                }
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401 && onLogout) {
                        setError('Session expired. Please log in again.');
                        onLogout();
                        navigate('/login');
                        return;
                    }
                    throw new Error(data.message || 'Failed to fetch profile data.');
                }
                setUserData({
                    name: data.name || '',
                    email: data.email || '',
                    username: data.username || '',
                    phone: data.phone || '',
                    profilePictureUrl: data.profilePictureUrl || '',
                });
                setImagePreviewUrl(data.profilePictureUrl || '');
            } catch (err) {
                console.error("Fetch profile error:", err);
                setError(err.message || 'An error occured while fetching your profile.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, onLogout]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setError('');
        setSuccessMessage('');
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setError('');
        setSuccessMessage('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setSelectedFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreviewUrl(userData.profilePictureUrl || '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Not authenticated. PLease log in.');
            return;
        }

        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);

        if (selectedFile) {
            formData.append('profilePictureFile', selectedFile);
        } else {
            formData.append('profilePictureUrl', userData.profilePictureUrl);
        }

        setIsLoading(true);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            if (!(formData instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: headers,
                body: (selectedFile || !(formData instanceof FormData)) ? formData : JSON.stringify(Object.fromEntries(formData))
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 && onLogout) {
                    setError('Session expired. Please log in again.');
                    onLogout();
                    navigate('/login');
                    return;
                }
                throw new Error(data.message || 'Failed to update profile.');
            }

            setSuccessMessage(data.message || 'Profile updated successfully');

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            const updatedCurrentUserForStorage = {
                id: data.id || data._id,
                username: data.username,
                name: data.name,
                email: data.email,
                phone: data.phone,
                profilePictureUrl: data.profilePictureUrl
            };
            setUserData(prev => ({...prev, profilePictureUrl: data.profilePictureUrl}));
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUserForStorage));
            setImagePreviewUrl(data.profilePictureUrl || '');

            if (onProfileUpdate) {
                onProfileUpdate(updatedCurrentUserForStorage);
            }

        } catch (err) {
            console.error("Update profile error:", err);
            setError(err.message || 'An error occured while updating your profile.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Not authenticated. Please log in.');
            return;
        }

        setIsLoading(true);
        try{
            const response = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401 && onLogout) {
                    setError('Session expired. Please log in again.');
                    onLogout();
                    navigate('/login');
                    return;
                }
                throw new Error(data.message || 'Failed to change password.');
            }
            setSuccessMessage(data.message || 'Password changed successfully.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setError(err.message || 'An error occured while changing your password.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !userData.username) {
        return <div className="profile-page-container"><p>Loading Profile...</p></div>
    }

    return (
        <div className="profile-page-container">
            <h1>Edit Profile</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="profile-form section-form" encType="multipart/form-data">
                <div className="profile-picture-section">
                    <img src={imagePreviewUrl || 'http://via.placeholder.com/150'} alt="Profile Preview" className="profile-picture-preview" />
                    <label htmlFor="profilePictureFile" className="file-input-label button-like">Choose Profile Picture</label>
                    <input type="file" id="profilePictureFile" name="profilePictureFile" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>

                <div className="form-group">
                    <label htmlFor="profilePictureUrl">Current Profile Picture Url:</label>
                    <input type="text" id="profilePictureUrl" name="profilePictureUrl" value={userData.profilePictureUrl} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input type="tel" id="phone" name="phone" value={userData.phone} onChange={handleChange} />
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </form>

            <hr className="section-divider" />

            <h2>Change Password</h2>
            <form onSubmit={handleChangePasswordSubmit} className="password-form section-form">
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmNewpassword">Confirm New Password:</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
                </div>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Changing...' : 'Change Password'}</button>
            </form>
        </div>
    );
}

export default ProfilePage;