// V-Sarkari Admin Panel
// Saves complete job data to Firebase Firestore
const db = firebase.firestore();
const auth = firebase.auth();

const googleLogin = document.getElementById("googleLogin");
const googleLogout = document.getElementById("googleLogout");
const publishBtn = document.getElementById("publishBtn");
const successMsg = document.getElementById("successMsg");

// ⚠️ यहाँ अपना सही Admin Gmail लिखें
const ADMIN_EMAIL = "your-admin-email@gmail.com"; 

// ================= AUTH =================
googleLogin.addEventListener("click", async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error(error);
        alert("Login failed: " + error.message);
    }
});

googleLogout.addEventListener("click", async () => {
    try {
        await auth.signOut();
        alert("Logged out successfully");
    } catch (error) {
        console.error(error);
    }
});

auth.onAuthStateChanged(user => {
    if (user) {
        // चेक करें कि क्या लॉगिन करने वाला अकाउंट एडमिन का है
        if (user.email === ADMIN_EMAIL) {
            googleLogin.style.display = "none";
            googleLogout.style.display = "inline-block";
            if (publishBtn) publishBtn.disabled = false;
        } else {
            // गलत अकाउंट होने पर मैसेज दिखाएं और लॉगआउट कर दें
            alert("Access Denied: केवल authorized एडमिन ही लॉगिन कर सकते हैं!");
            auth.signOut();
        }
    } else {
        googleLogin.style.display = "inline-block";
        googleLogout.style.display = "none";
        if (publishBtn) publishBtn.disabled = true;
    }
});

// ================= HELPER =================
function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

// ================= DATES =================
function collectDates() {
    const rows = document.querySelectorAll(".date-row");
    const dates = [];
    rows.forEach(row => {
        const label = row.querySelector(".date-label");
        const value = row.querySelector(".date-value");
        if (!label || !value) return;
        if (label.value.trim() || value.value.trim()) {
            dates.push({
                label: label.value.trim(),
                value: value.value.trim()
            });
        }
    });
    return dates;
}

// ================= VACANCIES =================
function collectVacancies() {
    const rows = document.querySelectorAll(".vacancy-row");
    const vacancies = [];
    rows.forEach(row => {
        const post = row.querySelector(".v-post");
        const total = row.querySelector(".v-total");
        const eligibility = row.querySelector(".v-eligibility");
        if (!post || !total || !eligibility) return;
        if (
            post.value.trim() ||
            total.value.trim() ||
            eligibility.value.trim()
        ) {
            vacancies.push({
                post: post.value.trim(),
                total: total.value.trim(),
                eligibility: eligibility.value.trim()
            });
        }
    });
    return vacancies;
}

// ================= FAQ =================
function collectFAQs() {
    const rows = document.querySelectorAll(".faq-row");
    const faqs = [];
    rows.forEach(row => {
        const question = row.querySelector(".faq-question");
        const answer = row.querySelector(".faq-answer");
        if (!question || !answer) return;
        if (
            question.value.trim() ||
            answer.value.trim()
        ) {
            faqs.push({
                question: question.value.trim(),
                answer: answer.value.trim()
            });
        }
    });
    return faqs;
}

// ================= GENERATE JOB ID =================
function generateJobId(title) {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug + "-" + Date.now();
}

// ================= PUBLISH JOB =================
publishBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user || user.email !== ADMIN_EMAIL) {
        alert("Please login with the authorized Admin account first.");
        return;
    }

    const title = getValue("jobTitle");
    if (!title) {
        alert("Please enter Job Title.");
        document.getElementById("jobTitle").focus();
        return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = "⏳ Publishing...";
    successMsg.textContent = "";

    try {
        const jobId = generateJobId(title);

        // ================= COMPLETE JOB DATA =================
        const jobData = {
            id: jobId,
            // Basic
            title: title,
            department: getValue("department"),
            postName: getValue("postName"),
            advertisementNo: getValue("advertisementNo"),
            category: getValue("category"),
            vacancy: getValue("vacancy"),
            applicationMode: getValue("applicationMode"),
            jobLocation: getValue("jobLocation"),
            // Main links
            applyLink: getValue("applyLink"),
            notificationLink: getValue("notificationLink"),
            officialLink: getValue("officialLink"),
            telegramLink: getValue("telegramLink"),
            whatsappLink: getValue("whatsappLink"),
            // Organization
            aboutOrganization: getValue("aboutOrganization"),
            // Dates
            importantDates: collectDates(),
            // Fee
            applicationFee: getValue("applicationFee"),
            // Age
            minAge: getValue("minAge"),
            maxAge: getValue("maxAge"),
            ageCutoffDate: getValue("ageCutoffDate"),
            ageRelaxation: getValue("ageRelaxation"),
            // Salary
            salary: getValue("salary"),
            salaryDetails: getValue("salaryDetails"),
            // Vacancy
            vacancies: collectVacancies(),
            categoryVacancy: getValue("categoryVacancy"),
            // Education
            qualification: getValue("qualification"),
            // Detailed information
            jobOverview: getValue("jobOverview"),
            postingLocations: getValue("postingLocations"),
            responsibilities: getValue("responsibilities"),
            selectionProcess: getValue("selectionProcess"),
            // Exam
            examPattern: getValue("examPattern"),
            syllabus: getValue("syllabus"),
            // Application
            howToApply: getValue("howToApply"),
            // Instructions
            importantInstructions: getValue("importantInstructions"),
            // FAQ
            faqs: collectFAQs(),
            // Extra
            additionalInfo: getValue("additionalInfo"),
            // Admin information
            createdBy: user.uid,
            createdByEmail: user.email || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            // Status
            status: "published"
        };

        // ================= SAVE TO FIRESTORE =================
        await db
            .collection("jobs")
            .doc(jobId)
            .set(jobData);

        // ================= SUCCESS =================
        successMsg.textContent = "✅ Job published successfully!";
        successMsg.style.color = "green";
        publishBtn.textContent = "✅ Published";

        alert("Job Published Successfully!\n\nJob ID:\n" + jobId);

        // Reset button after a moment
        setTimeout(() => {
            publishBtn.textContent = "🚀 Publish Job";
            publishBtn.disabled = false;
        }, 2500);

    } catch (error) {
        console.error("Publish error:", error);
        alert("❌ Job publish failed.\n\n" + error.message);
        successMsg.textContent = "❌ Something went wrong.";
        successMsg.style.color = "red";
        publishBtn.textContent = "🚀 Publish Job";
        publishBtn.disabled = false;
    }
});
