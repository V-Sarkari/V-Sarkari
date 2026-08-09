// V-Sarkari Admin Panel
// Firebase Authentication + Firestore

const db = firebase.firestore();
const auth = firebase.auth();

const googleLogin = document.getElementById("googleLogin");
const googleLogout = document.getElementById("googleLogout");
const publishBtn = document.getElementById("publishBtn");
const successMsg = document.getElementById("successMsg");

// ================= ADMIN EMAIL =================

const ADMIN_EMAIL = "officialvsarkari@gmail.com";

// ================= GOOGLE LOGIN =================

googleLogin.addEventListener("click", async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();

        provider.setCustomParameters({
            prompt: "select_account"
        });

        await auth.signInWithPopup(provider);

    } catch (error) {
        console.error("Login Error:", error);

        alert(
            "Google Login नहीं हो पाया.\n\n" +
            error.message
        );
    }
});

// ================= LOGOUT =================

googleLogout.addEventListener("click", async () => {
    try {
        await auth.signOut();

        alert("Logout successfully.");

    } catch (error) {
        console.error("Logout Error:", error);
        alert("Logout failed.\n\n" + error.message);
    }
});

// ================= AUTH STATE =================

auth.onAuthStateChanged((user) => {

    if (user) {

        if (
            user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            alert(
                "❌ Access Denied\n\n" +
                "केवल authorized Admin account से login करें."
            );

            auth.signOut();
            return;
        }

        googleLogin.style.display = "none";
        googleLogout.style.display = "inline-block";

        if (publishBtn) {
            publishBtn.disabled = false;
        }

        if (successMsg) {
            successMsg.textContent =
                "✅ Admin Login Successful: " + user.email;

            successMsg.style.color = "green";
        }

    } else {

        googleLogin.style.display = "inline-block";
        googleLogout.style.display = "none";

        if (publishBtn) {
            publishBtn.disabled = true;
        }

        if (successMsg) {
            successMsg.textContent = "";
        }
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

        if (
            label.value.trim() ||
            value.value.trim()
        ) {

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
        const eligibility =
            row.querySelector(".v-eligibility");

        if (!post || !total || !eligibility) return;

        if (
            post.value.trim() ||
            total.value.trim() ||
            eligibility.value.trim()
        ) {

            vacancies.push({
                post: post.value.trim(),
                total: total.value.trim(),
                eligibility:
                    eligibility.value.trim()
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

        const question =
            row.querySelector(".faq-question");

        const answer =
            row.querySelector(".faq-answer");

        if (!question || !answer) return;

        if (
            question.value.trim() ||
            answer.value.trim()
        ) {

            faqs.push({
                question:
                    question.value.trim(),

                answer:
                    answer.value.trim()
            });
        }
    });

    return faqs;
}

// ================= JOB ID =================

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

    if (
        !user ||
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        alert(
            "पहले authorized Admin account से login करें."
        );

        return;
    }

    const title = getValue("jobTitle");

    if (!title) {

        alert("कृपया Job Title डालें.");

        document
            .getElementById("jobTitle")
            ?.focus();

        return;
    }

    publishBtn.disabled = true;
    publishBtn.textContent = "⏳ Publishing...";

    try {

        const jobId = generateJobId(title);

        const jobData = {

            id: jobId,

            title: title,

            department:
                getValue("department"),

            postName:
                getValue("postName"),

            advertisementNo:
                getValue("advertisementNo"),

            category:
                getValue("category"),

            vacancy:
                getValue("vacancy"),

            applicationMode:
                getValue("applicationMode"),

            jobLocation:
                getValue("jobLocation"),

            applyLink:
                getValue("applyLink"),

            notificationLink:
                getValue("notificationLink"),

            officialLink:
                getValue("officialLink"),

            telegramLink:
                getValue("telegramLink"),

            whatsappLink:
                getValue("whatsappLink"),

            aboutOrganization:
                getValue("aboutOrganization"),

            importantDates:
                collectDates(),

            applicationFee:
                getValue("applicationFee"),

            minAge:
                getValue("minAge"),

            maxAge:
                getValue("maxAge"),

            ageCutoffDate:
                getValue("ageCutoffDate"),

            ageRelaxation:
                getValue("ageRelaxation"),

            salary:
                getValue("salary"),

            salaryDetails:
                getValue("salaryDetails"),

            vacancies:
                collectVacancies(),

            categoryVacancy:
                getValue("categoryVacancy"),

            qualification:
                getValue("qualification"),

            jobOverview:
                getValue("jobOverview"),

            postingLocations:
                getValue("postingLocations"),

            responsibilities:
                getValue("responsibilities"),

            selectionProcess:
                getValue("selectionProcess"),

            examPattern:
                getValue("examPattern"),

            syllabus:
                getValue("syllabus"),

            howToApply:
                getValue("howToApply"),

            importantInstructions:
                getValue("importantInstructions"),

            faqs:
                collectFAQs(),

            additionalInfo:
                getValue("additionalInfo"),

            createdBy:
                user.uid,

            createdByEmail:
                user.email,

            status: "published",

            createdAt:
                firebase.firestore.FieldValue
                    .serverTimestamp(),

            updatedAt:
                firebase.firestore.FieldValue
                    .serverTimestamp()
        };

        await db
            .collection("jobs")
            .doc(jobId)
            .set(jobData);

        if (successMsg) {

            successMsg.textContent =
                "✅ Job Published Successfully!";

            successMsg.style.color = "green";
        }

        publishBtn.textContent = "✅ Published";

        alert(
            "✅ Job Published Successfully!\n\n" +
            "Job ID:\n" +
            jobId
        );

        setTimeout(() => {

            publishBtn.textContent =
                "🚀 Publish Job";

            publishBtn.disabled = false;

        }, 2500);

    } catch (error) {

        console.error(
            "Publish Error:",
            error
        );

        alert(
            "❌ Job Publish Failed\n\n" +
            error.message
        );

        if (successMsg) {

            successMsg.textContent =
                "❌ Job publish failed.";

            successMsg.style.color = "red";
        }

        publishBtn.textContent =
            "🚀 Publish Job";

        publishBtn.disabled = false;
    }
});
