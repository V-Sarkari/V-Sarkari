const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("googleLogout");
const publishBtn = document.getElementById("publishBtn");

// Google Login
loginBtn.addEventListener("click", async () => {
    try {
        await auth.signInWithRedirect(provider);
    } catch (error) {
        alert("Login Error: " + error.message);
    }
});

// Google Login वापस आने के बाद
auth.getRedirectResult()
    .then((result) => {
        if (result.user) {
            alert("Login Successful");
        }
    })
    .catch((error) => {
        alert("Login Error: " + error.message);
    });

// Logout
logoutBtn.addEventListener("click", () => {
    auth.signOut();
});

// Login status
auth.onAuthStateChanged((user) => {

    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

        if (publishBtn) {
            publishBtn.disabled = false;
        }

    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";

        if (publishBtn) {
            publishBtn.disabled = true;
        }
    }
});
