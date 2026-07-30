const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("googleLogout");
const publishBtn = document.getElementById("publishBtn");

loginBtn.addEventListener("click", () => {
    auth.signInWithPopup(provider)
        .then(() => {
            alert("Login Successful");
        })
        .catch((error) => {
            alert(error.message);
        });
});

logoutBtn.addEventListener("click", () => {
    auth.signOut();
});

auth.onAuthStateChanged((user) => {

    if (user) {

        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

        publishBtn.disabled = false;

    } else {

        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";

        publishBtn.disabled = true;

    }

});
