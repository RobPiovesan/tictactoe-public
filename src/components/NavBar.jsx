import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { SignOut } from "../firebase";

function NavBar() {
  const user = useContext(UserContext);

  return (
    <nav className="navbar pl-3 pr-3 ">
      <Link className="black navbar-brand  m-2 h3" to="/">
        TicTacToe
      </Link>
      <div className="right"></div>
      <a className="nav-link username" href="/">
        {user && user.displayName}
      </a>
      {user && <SignOut />}
    </nav>
  );
}

export default NavBar;
