import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { setUpFirebase, useAuthState } from "./firebase";
import TicTacToe from "./components/TicTacToe";
import GameHome from "./components/GameHome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import "./App.css";

const [auth, firestore] = setUpFirebase();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <StoreProvider value={firestore}>
        <AuthProvider value={auth}>
          <UserProvider value={user}>
            <NavBar />
            <main>
              <Switch>
                <Route path="/game/:id" component={TicTacToe} />
                <Route path="/" component={GameHome} />
                <Redirect to="/"></Redirect>
              </Switch>
            </main>
            <Footer />
          </UserProvider>
        </AuthProvider>
      </StoreProvider>
    </div>
  );
}

export default App;
