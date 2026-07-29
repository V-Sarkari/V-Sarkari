// V-Sarkari App Started

console.log("Welcome to V-Sarkari");

// Dark Mode

const darkBtn = document.getElementById("darkModeBtn");

if (darkBtn) {
    darkBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}
// Dynamic Job Loader

fetch("data/jobs.json")
.then(response => response.json())
.then(jobs => {

const container = document.getElementById("jobsContainer");

if(!container) return;

jobs.forEach(job=>{

container.innerHTML += `

<div class="job-card">

<h3>${job.title}</h3>

<p>${job.department}</p>

<p><b>Qualification:</b> ${job.qualification}</p>

<p><b>Last Date:</b> ${job.lastDate}</p>

<a href="job-details.html">

<button>${job.status}</button>

</a>

</div>

`;

});

});
// Smart Search

const searchInput = document.getElementById("searchInput");

if (searchInput) {

searchInput.addEventListener("keyup", function () {

const value = this.value.toLowerCase();

const cards = document.querySelectorAll(".job-card");

cards.forEach(card => {

const text = card.innerText.toLowerCase();

if (text.includes(value)) {

card.style.display = "block";

} else {

card.style.display = "none";

}

});

});

}
// Notification Panel

const bell = document.getElementById("notificationBtn");

const panel = document.getElementById("notificationPanel");

if(bell && panel){

bell.addEventListener("click",()=>{

if(panel.style.display==="block"){

panel.style.display="none";

}else{

panel.style.display="block";

}

});

}
