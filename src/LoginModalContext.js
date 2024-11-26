// src/LoginModalContext.js
import React, { createContext, useState, useContext } from 'react';

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  return (
    <LoginModalContext.Provider
      value={{
        openLoginModal,
        handleOpenLoginModal,
        handleCloseLoginModal,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
