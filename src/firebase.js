import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthContext from "./context/AuthContext";
import "firebase/firestore";
import "firebase/auth";
import { useContext } from "react";
import { FIREBASE_DATA } from "./firebaseConfig";

export function setUpFirebase() {
  firebase.initializeApp(FIREBASE_DATA);

  const auth = firebase.auth();
  const firestore = firebase.firestore();
  return [auth, firestore];
}

export function SignIn() {
  const auth = useContext(AuthContext);
  const signInWithGoogle = (auth) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="btn btn-success" onClick={() => signInWithGoogle(auth)}>
      <div className="m-1">Sign in with Google</div>
    </button>
  );
}

export function SignOut() {
  const auth = useContext(AuthContext);
  return (
    auth.currentUser && (
      <button
        className="btn btn-warning"
        onClick={() => {
          window.location.replace("/");
          auth.signOut();
        }}
      >
        <div className="sign-out"></div>
      </button>
    )
  );
}

export async function sendPlayToFirebase(position, player, uid, movesRef) {
  console.log();
  await movesRef.add({
    player,
    position,
    uid,
    playedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export async function addPlayerFirebase(player, playersRef) {
  await playersRef.add({ player });
}

export { useAuthState };
