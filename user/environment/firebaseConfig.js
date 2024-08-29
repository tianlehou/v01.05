import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkqqfE8O_QRcwDbITt6ZpCSb04qcjdU10",
  authDomain: "tekisusu-3a35f.firebaseapp.com",
  databaseURL: "https://tekisusu-3a35f-default-rtdb.firebaseio.com",
  projectId: "tekisusu-3a35f",
  storageBucket: "tekisusu-3a35f.appspot.com",
  messagingSenderId: "841015290162",
  appId: "1:841015290162:web:81e92e74f1369157018f2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };