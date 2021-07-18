import React from "react";

const StoreContext = React.createContext({});
StoreContext.displayName = "StoreContext";

export const StoreProvider = StoreContext.Provider;
export default StoreContext;
