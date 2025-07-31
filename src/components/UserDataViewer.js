import React, { useState, useEffect } from 'react';
import { getRegisteredUsers, clearAllUsers, exportUsersData, debugUsers } from '../utils/userStorage';

function UserDataViewer() {
    const [users, setUsers] = useState([]);
    const [showViewer, setShowViewer] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        const registeredUsers = getRegisteredUsers();
        setUsers(registeredUsers);
    };

    const handleClearUsers = () => {
        if (window.confirm('Are you sure you want to clear all registered users?')) {
            clearAllUsers();
            loadUsers();
            alert('All users cleared!');
        }
    };

    const handleExportUsers = () => {
        exportUsersData();
        alert('Users data exported to downloads folder!');
    };

    const handleDebugLog = () => {
        debugUsers();
        alert('Check the browser console for user data!');
    };

    if (!showViewer) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <button 
                    onClick={() => setShowViewer(true)}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    🔍 Debug Users
                </button>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '2px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Registered Users Viewer</h2>
                <button 
                    onClick={() => setShowViewer(false)}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}
                >
                    ✕ Close
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={loadUsers} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    🔄 Refresh
                </button>
                <button onClick={handleDebugLog} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    📋 Log to Console
                </button>
                <button onClick={handleExportUsers} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    💾 Export JSON
                </button>
                <button onClick={handleClearUsers} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    🗑️ Clear All
                </button>
            </div>

            <div>
                <h3>Total Users: {users.length}</h3>
                {users.length === 0 ? (
                    <p style={{ color: '#666' }}>No registered users yet. Register some users to see them here!</p>
                ) : (
                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {users.map((user, index) => (
                            <div key={user.id || index} style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                padding: '15px',
                                marginBottom: '10px',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    <div><strong>ID:</strong> {user.id}</div>
                                    <div><strong>Username:</strong> {user.username}</div>
                                    <div><strong>Email:</strong> {user.email}</div>
                                    <div><strong>Name:</strong> {user.name}</div>
                                    <div><strong>Role:</strong> {user.role}</div>
                                    <div><strong>Password:</strong> {user.password}</div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <strong>Registered:</strong> {user.registeredAt ? new Date(user.registeredAt).toLocaleString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', fontSize: '12px' }}>
                <strong>Tips:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>Click "Log to Console" to see data in browser console (F12)</li>
                    <li>Click "Export JSON" to download the data as a file</li>
                    <li>Use "Clear All" to reset all registered users</li>
                    <li>This data is stored in your browser's localStorage</li>
                </ul>
            </div>
        </div>
    );
}

export default UserDataViewer;
