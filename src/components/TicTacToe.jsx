import React, { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import UserContext from "../context/UserContext";
import StoreContext from "../context/StoreContext";
import GameButton from "./GameButton";
import PlayersComp from "./PlayersComp";

let gameWonX = false;
let gameWonO = false;

export default function TicTacToe(props) {
  const user = useContext(UserContext);
  const store = useContext(StoreContext);
  const gameId = props.match.params.id;
  const [gameRef, movesRef] = getRefs(store, gameId);

  // initialize
  const [values] = useCollectionData(movesRef.orderBy("playedAt", "desc"), {
    idField: "id",
  });
  const [games] = useCollectionData(store.collection("games"), {
    idField: "id",
  });

  const allData = [gameId, gameRef, values, games, user];
  let [noughtsOrCrosses, players, wins, gameCompleted, uid] =
    initializeApp(allData);
  // -- end initialize

  var newGameButtonClass =
    gameWonX || gameWonO || (values && values.length >= 9)
      ? "btn btn-primary mt-2"
      : "hidden";

  return (
    <React.Fragment>
      {games && isGameValid(games, gameId) && !noughtsOrCrosses && user && (
        <JoinGame
          user={user}
          gameRef={gameRef}
          games={games}
          gameId={gameId}
        ></JoinGame>
      )}
      {games && !isGameValid(games, gameId) && (
        <div className="game-home">
          <div className="lead">Oops! that's not a valid game ID</div>
          <button
            className="btn btn-primary m-4"
            onClick={() => {
              window.location.replace("/");
            }}
          >
            Return to home
          </button>
        </div>
      )}

      {noughtsOrCrosses && (
        <div className="game-container">
          <PlayersComp
            players={players}
            gameWonX={gameWonX}
            gameWonO={gameWonO}
            wins={wins}
          ></PlayersComp>

          <div className="tictactoe-container comp-container">
            {renderTicTacToe(
              values,
              uid,
              movesRef,
              noughtsOrCrosses,
              gameCompleted
            )}
          </div>

          <button
            className={newGameButtonClass}
            onClick={() => newGame(movesRef)}
          >
            New Game
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

const getRefs = (store, gameId) => {
  const gameRef = store.collection("games").doc(gameId);
  const movesRef = gameRef.collection("moves");

  return [gameRef, movesRef];
};

const isGameValid = (games, gameId) => {
  var gameIds = games.map((g) => {
    if (g.id === gameId) {
      return g.id;
    } else return null;
  });

  return gameIds.includes(gameId);
};

const isGameValidToJoin = (games, gameId) => {
  var gameIds = games.map((g) => {
    if (g.id === gameId && !g.oPlayer) {
      return g.id;
    } else return null;
  });

  return gameIds.includes(gameId);
};

function JoinGame(props) {
  function onJoin(gameRef, user) {
    gameRef.get().then((doc) => {
      return gameRef.set({
        ...doc.data(),
        oPlayer: {
          ...doc.data().oPlayer,
          uid: user.uid,
          photoUrl: user.photoURL,
          displayName: user.displayName,
        },
      });
    });
  }

  const inValid = (
    <div className="game-home">
      <div className="lead">Oops! that's not a valid game ID</div>
      <button
        className="btn btn-primary m-4"
        onClick={() => {
          window.location.replace("/");
        }}
      >
        Return to home
      </button>
    </div>
  );

  const valid = (
    <div className="game-home">
      <p className="lead">Would you like to join this game?</p>
      <button
        className="btn btn-primary"
        onClick={() => onJoin(props.gameRef, props.user)}
      >
        Join
      </button>
    </div>
  );

  return isGameValidToJoin(props.games, props.gameId) ? valid : inValid;
}

const getPlayerData = (games, gameId) => {
  let xPlayer;
  let oPlayer;
  if (
    games &&
    isGameValid(games, gameId) &&
    games.filter((game) => game.id === gameId)[0].xPlayer
  ) {
    xPlayer = games.filter((game) => game.id === gameId)[0].xPlayer;
  }
  if (
    games &&
    isGameValid(games, gameId) &&
    games.filter((game) => game.id === gameId)[0].oPlayer
  ) {
    oPlayer = games.filter((game) => game.id === gameId)[0].oPlayer;
  }

  return [xPlayer, oPlayer];
};

const getWinData = (games, gameId) => {
  let wins = [0, 0];
  if (
    games &&
    isGameValid(games, gameId) &&
    games.filter((game) => game.id === gameId)[0].winCount &&
    games.filter((game) => game.id === gameId)[0].winCount.x
  ) {
    wins[0] = games.filter((game) => game.id === gameId)[0].winCount.x;
  }
  if (
    games &&
    isGameValid(games, gameId) &&
    games.filter((game) => game.id === gameId)[0].winCount &&
    games.filter((game) => game.id === gameId)[0].winCount.o
  ) {
    wins[1] = games.filter((game) => game.id === gameId)[0].winCount.o;
  }

  return wins;
};

const getNoughtsOrCrosses = (uid, games, gameId) => {
  if (
    uid &&
    games &&
    games.filter((game) => game.id === gameId)[0].xPlayer &&
    games.filter((game) => game.id === gameId)[0].xPlayer.uid === uid
  ) {
    return "x";
  } else if (
    uid &&
    games &&
    games.filter((game) => game.id === gameId)[0].oPlayer &&
    games.filter((game) => game.id === gameId)[0].oPlayer.uid === uid
  ) {
    return "o";
  }
  return null;
};

const hasWinner = (values, gameRef, playersFromServer, uid) => {
  const winningPositions = [
    //Verticals
    ["topLeft", "midLeft", "botLeft"],
    ["topMid", "midMid", "botMid"],
    ["topRight", "midRight", "botRight"],
    //Horizontals
    ["topLeft", "topMid", "topRight"],
    ["midLeft", "midMid", "midRight"],
    ["botLeft", "botMid", "botRight"],
    //Diagonals
    ["topLeft", "midMid", "botRight"],
    ["topRight", "midMid", "botLeft"],
  ];

  const players = ["x", "o"];
  let winner = "";

  if (values) {
    players.map((player) => {
      const playerMoves = values.filter((move) => move.player === player);
      let playerPositions = playerMoves.map((a) => a.position);

      const win = winningPositions.map((winningPos) => {
        if (
          playerPositions.includes(winningPos[0]) &&
          playerPositions.includes(winningPos[1]) &&
          playerPositions.includes(winningPos[2])
        )
          return true;
        return false;
      });

      if (win.includes(true) && player === "x") {
        if (!gameWonX) {
          if (playersFromServer[0] && uid && playersFromServer[0].uid === uid) {
            gameRef.get().then((doc) => {
              let winCount = 0;
              if (doc.data().winCount && doc.data().winCount.x) {
                winCount = doc.data().winCount.x;
              }
              winCount++;

              return gameRef.set({
                ...doc.data(),
                winCount: { ...doc.data().winCount, x: winCount },
              });
            });
          }
          gameWonX = true;
        }
        winner = player;
      }

      if (win.includes(true) && player === "o") {
        if (!gameWonO) {
          if (playersFromServer[1] && uid && playersFromServer[1].uid === uid) {
            gameRef.get().then((doc) => {
              let winCount = 0;
              if (doc.data().winCount && doc.data().winCount.o) {
                winCount = doc.data().winCount.o;
              }
              winCount++;

              return gameRef.set({
                ...doc.data(),
                winCount: { ...doc.data().winCount, o: winCount },
              });
            });
          }
          gameWonO = true;
        }
        winner = player;
      }
      return true;
    });
  }

  return winner;
};

function newGame(movesRef) {
  movesRef.get().then((res) => {
    res.forEach((element) => {
      element.ref.delete();
    });
  });
}

function initializeApp(allData) {
  let [gameId, gameRef, values, games, user] = allData;

  let uid;
  if (user) uid = user.uid;

  let noughtsOrCrosses;
  if (games && isGameValid(games, gameId)) {
    noughtsOrCrosses = getNoughtsOrCrosses(uid, games, gameId);
  }

  const players = getPlayerData(games, gameId);
  const wins = getWinData(games, gameId);
  const gameCompleted = hasWinner(values, gameRef, players, uid);
  if (values && values.length === 0) {
    gameWonX = false;
    gameWonO = false;
  }
  return [noughtsOrCrosses, players, wins, gameCompleted, uid];
}

function renderTicTacToe(values, uid, movesRef, noughtsOrCrosses, winner) {
  const topPositions = ["topLeft", "topMid", "topRight"];
  const midPositions = ["midLeft", "midMid", "midRight"];
  const botPositions = ["botLeft", "botMid", "botRight"];
  const positions = [topPositions, midPositions, botPositions];

  return (
    <div className="ctr">
      {positions.map((posSection) => (
        <div key={posSection}>
          <div className="row" key={posSection}>
            {posSection.map((pos) => {
              let className_ = `col-auto ${posSection[0]} `;

              if (pos.includes("Mid")) {
                className_ += "mid-col ";
              }
              if (pos.includes("mid")) {
                className_ += "mid-row ";
              }
              return (
                <div key={posSection + pos} className={className_}>
                  <GameButton
                    position={pos}
                    values={values}
                    uid={uid}
                    moveRef={movesRef}
                    noughtsOrCrosses={noughtsOrCrosses}
                    winner={winner}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
