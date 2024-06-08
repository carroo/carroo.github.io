// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBzaId-d6p1y5Ub0A9zHdDxJ-ZLAYo_O9E",
    authDomain: "carroo-b895f.firebaseapp.com",
    projectId: "carroo-b895f",
    storageBucket: "carroo-b895f.appspot.com",
    messagingSenderId: "21150656143",
    appId: "1:21150656143:web:5a871b064196bfc3b872fa",
    measurementId: "G-0QHHSNP6DE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

// Function to get visitor's IP information from ipinfo.io and store it in Firebase Firestore
function storeVisitorInfo() {
    fetch('https://ipinfo.io/json?token=9f191163d8c212')
        .then(response => response.json())
        .then(data => {
            // Save the visitor's IP information to Firestore
            setTimeout(() => {
                const visitorsCollection = collection(firestore, 'visitors');
                addDoc(visitorsCollection, {
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    loc: data.loc, // Latitude and Longitude
                    org: data.org,
                    timestamp: new Date(),
                    domain: window.location.hostname, // Domain saat ini
                    // You can save more information if needed
                })
                    .then(() => {
                        //console.log("Visitor's information saved successfully!");
                    })
                    .catch(error => {
                        //console.error("Error saving visitor's information:", error);
                    });
            }, 10000); // Delay 10 second
        })
        .catch(error => {
            //console.error("Error fetching visitor's IP information:", error);
        });
}

// Call the function to store visitor's IP information when the page loads
storeVisitorInfo();