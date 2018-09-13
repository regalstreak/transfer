import { config } from "./firebaseconf";
import Firebase from "firebase";

let app = Firebase.initializeApp(config);
const db = app.database();
const storage = app.storage();
const firestore = app.firestore();

export { db, storage, firestore };
