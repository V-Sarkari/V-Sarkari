// V-Sarkari App Started

console.log("Welcome to V-Sarkari");

// Dark Mode

const darkBtn = document.getElementById("darkModeBtn");

if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}
