import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    isAdmin: null,
    login: (token, userId, isAdmin, tokenExpiration, name, lastname, imageUrl) => {},
    logout: () => {}
});