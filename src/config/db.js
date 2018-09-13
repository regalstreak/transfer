import { config } from "./firebaseconf";
import Firebase from "firebase";

let app = Firebase.initializeApp(config);
const db = app.database();
const storage = app.storage();
export { db, storage };
