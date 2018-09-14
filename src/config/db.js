import { config } from "./firebaseconf";

const Firebase = require("firebase");
require("firebase/firestore");

let app = Firebase.initializeApp(config);
const db = app.database();
const storage = app.storage();
const firestore = app.firestore();
firestore.settings({ timestampsInSnapshots: true });

app
  .firestore()
  .enablePersistence()
  .catch(function(err) {
    if (err.code == "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
// Subsequent queries will use persistence, if it was enabled successfully

export { db, storage, firestore };
