import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDkp6VZmVEUh5PgGcCLRO99OCJvU8F7RqU",
    authDomain: "vizu-e94d7.firebaseapp.com",
    projectId: "vizu-e94d7",
    storageBucket: "vizu-e94d7.appspot.com",
    messagingSenderId: "595758892845",
    appId: "1:595758892845:web:8276ad2a81abcba6aa35a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Έλεγχος κατάστασης χρήστη
onAuthStateChanged(auth, (user) => {
    const userMenu = document.getElementById("userMenu");
    if (user) {
        userMenu.style.display = "block";
        renderProjects(); // δείχνει projects μόνο αν είναι logged in
    } else {
        userMenu.style.display = "none";
        clearProjects();
    }
});

// Logout
window.logout = function () {
    signOut(auth)
        .then(() => {
            alert("You have been logged out.");
            location.reload();
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
};

// Render saved projects (μόνο αν είναι logged in)
function renderProjects() {
    const gallery = document.getElementById("projectGallery");
    const docs = JSON.parse(localStorage.getItem("vizuDocs") || "{}");

    gallery.innerHTML = "";

    if (Object.keys(docs).length === 0) {
        gallery.innerHTML = "<p>There are no saved documents yet.</p>";
        return;
    }

    Object.entries(docs).forEach(([title, content]) => {
        const div = document.createElement("div");
        div.className = "project-card";

        const h3 = document.createElement("h3");
        h3.textContent = title;

        const preview = document.createElement("div");
        preview.className = "preview";
        preview.innerText = content.replace(/<[^>]+>/g, "").slice(0, 100) + "...";

        const openBtn = document.createElement("button");
        openBtn.textContent = "Open";
        openBtn.onclick = () => openDoc(title);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteDoc(title);

        const btnContainer = document.createElement("div");
        btnContainer.className = "card-buttons";
        btnContainer.appendChild(openBtn);
        btnContainer.appendChild(deleteBtn);

        div.appendChild(h3);
        div.appendChild(preview);
        div.appendChild(btnContainer);

        gallery.appendChild(div);
    });
}

// Clear gallery
function clearProjects() {
    const gallery = document.getElementById("projectGallery");
    if (gallery) gallery.innerHTML = "";
}

// Start Writing button
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        document.getElementById("login-popup").classList.remove("hidden");
        return;
    }

    const title = prompt("Give a title for your Project:");
    if (!title) return;

    const docs = JSON.parse(localStorage.getItem("vizuDocs") || "{}");

    if (docs[title]) {
        const overwrite = confirm("A document with this name already exists. Do you want to replace it?");
        if (!overwrite) return;
    }

    docs[title] = "<p></p>";
    localStorage.setItem("vizuDocs", JSON.stringify(docs));
    localStorage.setItem("currentDoc", title);

    window.location.href = "vizu.html";
});

// Open document
window.openDoc = function (title) {
    localStorage.setItem("currentDoc", title);
    window.location.href = "vizu.html";
};

// Delete document
window.deleteDoc = function (title) {
    const confirmed = confirm(`Are you sure you want to delete the document "${title}"?`);
    if (!confirmed) return;

    const docs = JSON.parse(localStorage.getItem("vizuDocs") || "{}");
    delete docs[title];
    localStorage.setItem("vizuDocs", JSON.stringify(docs));

    location.reload();
};

// Close popup
window.closePopup = function () {
    document.getElementById("login-popup").classList.add("hidden");
};
