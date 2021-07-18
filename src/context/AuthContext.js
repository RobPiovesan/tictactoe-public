import React from "react";

const AuthContext = React.createContext({});
AuthContext.displayName = "AuthContext";

export const AuthProvider = AuthContext.Provider;
export default AuthContext;
