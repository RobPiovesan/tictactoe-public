import React from "react";

const UserContext = React.createContext({});
UserContext.displayName = "UserContext";

export const UserProvider = UserContext.Provider;
export default UserContext;
