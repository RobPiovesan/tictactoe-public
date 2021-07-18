import React, { useContext } from "react";
import { SignIn } from "../firebase";
import UserContext from "../context/UserContext";
import StoreContext from "../context/StoreContext";

function GameHome(props) {
  const user = useContext(UserContext);
  const store = useContext(StoreContext);

  let gameID;

  function onGameChange({ currentTarget: input }) {
    gameID = input.value;
  }

  function joinGame() {
    props.history.push(`/game/${gameID}`);
  }

  return (
    <div className="game-home comp-container">
      <span>
        <div className="title-text m-2">TicTacToe</div>
        <div className="lead mb-3">A Project by Rob Piovesan</div>
      </span>

      {user ? (
        <div className="m-2">
          <button
            className="btn btn-primary m-1"
            onClick={() => createNewGame(store, user, props.history.push)}
          >
            <div className="">Create a new game</div>
          </button>
          <div>
            <div className="m-2">or join an existing game game</div>
            <input
              type="text"
              value={gameID}
              placeholder="Game ID"
              onChange={onGameChange}
            ></input>
            <button className="btn btn-secondary m-3" onClick={joinGame}>
              <div className="">Join</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="m-5">
          <SignIn />
        </div>
      )}
    </div>
  );
}

function createNewGame(store, user, push) {
  var newGameRef = store.collection("games").doc();
  newGameRef.set({});
  newGameRef.set({
    xPlayer: {
      uid: user.uid,
      photoUrl: user.photoURL,
      displayName: user.displayName,
    },
  });
  newGameRef.collection("moves").doc().set({});

  console.log("new game ref", newGameRef.id);
  push(`/game/${newGameRef.id}`);
}

export default GameHome;
