import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const PlayersComp = (props) => {
  const xPlayer = props.players[0];
  const oPlayer = props.players[1];

  const Player = ({ player, value, won, wins }) => {
    let SVGclassName_ = "align-middle mr-2 ";
    if (value === "x") SVGclassName_ += "xPlayer ";
    if (value === "o") SVGclassName_ += "oPlayer ";

    let className_ = "pt-1 ";

    className_ += won ? "winner " : "loser ";

    return (
      <div className={className_}>
        <div className="border-1">
          <div className={SVGclassName_}></div>
        </div>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip {...props}>{player.displayName}</Tooltip>}
        >
          <img
            className="round-img img-sm mr-2 ml-2"
            src={player.photoUrl}
            alt="profile"
          ></img>
        </OverlayTrigger>
        <div className="bold name ml-2"> Total Wins : {wins} </div>
      </div>
    );
  };

  return (
    <div className="comp-container fit-content p-3 left player">
      {xPlayer && xPlayer.uid && (
        <div>
          <Player
            player={xPlayer}
            wins={props.wins[0]}
            value="x"
            won={props.gameWonX}
          ></Player>
        </div>
      )}
      {oPlayer && oPlayer.uid && (
        <div>
          <hr />
          <Player
            player={oPlayer}
            wins={props.wins[1]}
            value="o"
            won={props.gameWonO}
          ></Player>
        </div>
      )}
      {!oPlayer && (
        <div className="lead">
          <hr />
          <CopyLinkBtn />
          Invite another player
        </div>
      )}
    </div>
  );
};

class CopyLinkBtn extends Component {
  state = {
    btnText: "Copy Link",
    btnClass: "btn btn-primary mr-3",
  };

  copyLink = () => {
    var dummy = document.createElement("input");
    var text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    this.setState({ btnText: "Link Copied", btnClass: "btn btn-success mr-3" });
    setTimeout(() => {
      this.setState({ btnText: "Copy Link", btnClass: "btn btn-primary mr-3" });
    }, 2000);
  };

  render() {
    return (
      <button onClick={this.copyLink} className={this.state.btnClass}>
        {this.state.btnText}
      </button>
    );
  }
}

export default PlayersComp;
