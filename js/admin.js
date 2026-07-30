
const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("googleLogout");

loginBtn.onclick = () => {
  firebase.auth().signInWithPopup(provider);
};

logoutBtn.onclick = () => {
  firebase.auth().signOut();
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    console.log("Logged in:", user.email);
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
