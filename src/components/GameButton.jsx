import React from "react";
import { sendPlayToFirebase } from "../firebase";

export default function GameButton(props) {
  let play;

  // Puts the x or o in the button text
  if (props.values) {
    const move = props.values.filter(
      (move_) => move_.position === props.position
    );
    if (move[0]) play = move[0].player;
  }

  let playerClass = `gameButton ${props.position} `;
  if (play === "x") {
    playerClass += "xPlayer-btn";
  }
  if (play === "o") {
    playerClass += "oPlayer-btn";
  }

  return (
    <div key={props.position}>
      {props.winner ? (
        <button className={playerClass}></button>
      ) : (
        <div>
          <button
            className={playerClass}
            onClick={() =>
              sendPlay(
                props.position,
                props.noughtsOrCrosses,
                props.values,
                props.uid,
                props.moveRef
              )
            }
          ></button>
        </div>
      )}
    </div>
  );
}

function sendPlay(position, player, plays, uid, movesRef) {
  const alreadyPlayed =
    plays.filter((move) => move.position === position).length > 0;

  if (plays[0] && plays[0].uid === uid) {
    console.log("not your turn");
    return;
  }

  if (alreadyPlayed) {
    alert("Someone has already played here");
  } else {
    sendPlayToFirebase(position, player, uid, movesRef);
  }
}
