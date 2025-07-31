// Utility functions for managing user storage

// Get all registered users
export const getRegisteredUsers = () => {
    try {
        return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    } catch (error) {
        console.error('Error reading registered users:', error);
        return [];
    }
};

// Add a new user
export const addUser = (userData) => {
    try {
        const users = getRegisteredUsers();
        const newUser = {
            ...userData,
            id: Date.now(),
            registeredAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return newUser;
    } catch (error) {
        console.error('Error adding user:', error);
        return null;
    }
};

// Check if user exists
export const userExists = (username, email) => {
    const users = getRegisteredUsers();
    return users.some(user => 
        user.username === username || user.email === email
    );
};

// Get user by username or email
export const getUser = (usernameOrEmail) => {
    const users = getRegisteredUsers();
    return users.find(user => 
        user.username === usernameOrEmail || user.email === usernameOrEmail
    );
};

// Clear all registered users (for debugging)
export const clearAllUsers = () => {
    localStorage.removeItem('registeredUsers');
};

// Export users data as JSON (for debugging)
export const exportUsersData = () => {
    const users = getRegisteredUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registered_users.json';
    link.click();
    URL.revokeObjectURL(url);
};

// Debug function to log current users
export const debugUsers = () => {
    const users = getRegisteredUsers();
    console.log('Currently registered users:', users);
    console.log('Total users:', users.length);
    
    if (users.length > 0) {
        console.table(users); // Nice table format in console
    }
    
    return users;
};

// Quick function to view all localStorage data
export const viewAllLocalStorage = () => {
    console.log('=== ALL LOCALSTORAGE DATA ===');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        try {
            const parsedValue = JSON.parse(value);
            console.log(`${key}:`, parsedValue);
        } catch {
            console.log(`${key}:`, value);
        }
    }
    console.log('==============================');
};
