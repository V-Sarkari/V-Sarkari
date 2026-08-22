// =========================
// V-Sarkari 2.0
// app.js - Part 1
// =========================

// Dark Mode

const darkBtn = document.getElementById("darkBtn");

if (darkBtn) {
  darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
};

// Search

const searchInput = document.querySelector(".search-area input");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    let cards = document.querySelectorAll(".job-card");

    cards.forEach(card => {

      if (card.innerText.toLowerCase().includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }

    });

  });
}

// Notification

const notifyBtn = document.getElementById("notificationBtn");

if (notifyBtn) {

  notifyBtn.onclick = () => {

    alert("🔔 Welcome to V-Sarkari\n\nLatest Government Jobs are available.");

  };

}

// Profile

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {

  profileBtn.onclick = () => {

    window.location.href = "profile.html";

  };

}
// =========================
// V-Sarkari 2.0
// app.js - Part 2
// =========================

// Scroll To Top Button

const topBtn = document.createElement("button");
topBtn.innerHTML = "⬆";
topBtn.id = "topBtn";

document.body.appendChild(topBtn);

topBtn.style.cssText = `
position:fixed;
bottom:90px;
right:20px;
width:50px;
height:50px;
border:none;
border-radius:50%;
background:#0a4ea3;
color:#fff;
font-size:22px;
cursor:pointer;
display:none;
box-shadow:0 5px 15px rgba(0,0,0,.25);
z-index:99999;
`;

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

// Active Bottom Navigation

const navLinks=document.querySelectorAll(".bottom-nav a");

navLinks.forEach(link=>{

link.addEventListener("click",()=>{

navLinks.forEach(item=>item.classList.remove("active"));

link.classList.add("active");

});

});

// Hero Animation

const hero=document.querySelector(".hero");

if(hero){

hero.animate(

[

{

opacity:0,

transform:"translateY(40px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],

{

duration:900,

fill:"forwards"

}

);

}

// Job Card Animation

const cards=document.querySelectorAll(".job-card");

cards.forEach((card,index)=>{

card.animate(

[

{

opacity:0,

transform:"translateY(30px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],

{

duration:700,

delay:index*120,

fill:"forwards"

}

);

});

// Welcome Message

setTimeout(()=>{

console.log("✅ Welcome to V-Sarkari");

},1000);

// Telegram Button Tracking

const telegram=document.querySelector(".telegram");

if(telegram){

telegram.addEventListener("click",()=>{

console.log("Telegram Clicked");

});

}

// WhatsApp Button Tracking

const whatsapp=document.querySelector(".whatsapp");

if(whatsapp){

whatsapp.addEventListener("click",()=>{

console.log("WhatsApp Clicked");

});

}



// ==========================================
// V-Sarkari Homepage
// Firebase Jobs Loader
// ==========================================

const jobsContainer = document.getElementById("latestJobs");


// ==========================================
// LOAD LATEST JOBS
// ==========================================

async function loadLatestJobs() {

    if (!jobsContainer) {
        console.error("❌ latestJobs container नहीं मिला.");
        return;
    }

    try {

        jobsContainer.innerHTML = `
            <div class="loading-box">
                ⏳ Latest Government Jobs Loading...
            </div>
        `;

        const snapshot = await db
            .collection("jobs")
            .where("status", "==", "published")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        if (snapshot.empty) {

            jobsContainer.innerHTML = `
                <div class="empty-box">
                    📭 अभी कोई Government Job Published नहीं है।
                </div>
            `;

            return;
        }


        let html = "";


        snapshot.forEach(function(doc) {

            const job = doc.data();


            html += `

                <div class="job-card">

                    <div class="job-card-header">

                        <span class="job-category">
                            ${escapeHTML(job.category || "Government Job")}
                        </span>

                        <span class="job-new">
                            NEW
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(job.title || "Government Job")}
                    </h3>


                    <p>
                        🏢
                        ${escapeHTML(job.department || "")}
                    </p>


                    <p>
                        📊 Vacancy:
                        ${escapeHTML(job.vacancy || "Not Mentioned")}
                    </p>


                    <p>
                        📍
                        ${escapeHTML(job.jobLocation || "All India")}
                    </p>


                    <div class="job-buttons">

                        <a
                            href="job-details.html?id=${encodeURIComponent(job.id)}"
                            class="view-job-btn">

                            👁️ View Details

                        </a>


                        ${
                            job.applyLink
                            ?
                            `
                            <a
                                href="${safeURL(job.applyLink)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="apply-job-btn">

                                Apply Online

                            </a>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

            `;

        });


        jobsContainer.innerHTML = html;


    } catch (error) {

        console.error(
            "❌ Latest Jobs Error:",
            error
        );


        jobsContainer.innerHTML = `
            <div class="error-box">

                ❌ Latest Jobs load नहीं हो सकीं।

                <br><br>

                कृपया थोड़ी देर बाद फिर कोशिश करें।

            </div>
        `;

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// SAFE URL
// ==========================================

function safeURL(url) {

    if (!url) {
        return "#";
    }

    try {

        const parsed =
            new URL(url);

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {

            return parsed.href;

        }

    } catch (error) {

        console.warn(
            "Invalid URL:",
            url
        );

    }

    return "#";

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadLatestJobs();

    }
);
