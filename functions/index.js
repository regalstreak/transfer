const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require("express");
const bodyParser = require("body-parser")
const os = require('os');
const fs = require('fs');
const request = require("request");
const rp = require("request-promise");
const { Storage } = require('@google-cloud/storage');


const MAILGUN_API_KEY = require("./config/mailgun_api_key.json").apiKey;
const storage = new Storage({
    projectId: 'transfer-2e740',
    keyFilename: './config/service_account.json'
});
const bucket = storage.bucket('transfer-2e740.appspot.com');


admin.initializeApp({
    credential: admin.credential.cert(require("./config/service_account.json")),
    databaseURL: "https://transfer-2e740.firebaseio.com"
});

const app1 = express();


app1.use(bodyParser.urlencoded({ extended: true }));


app1.post("/transfer_mail", (req, res, next) => {
    subject = req.body.subject;
    console.log(subject)
    console.log("\n")
    sender = req.body.sender;
    console.log(sender)
    console.log("\n")
    attachmentsJson = JSON.parse(req.body.attachments)
    console.log(attachmentsJson[0])
    attachmentUrl = attachmentsJson[0].url
    attachmentName = attachmentsJson[0].name
    attachmentContentType = attachmentsJson[0]["content-type"]
    console.log(attachmentName + attachmentContentType + ":  " + attachmentUrl)

    let uploadFile = bucket.file("files/" + subject + "/" + attachmentName);

    let ffile = rp.get({
        uri: attachmentUrl,
        headers: {
            "Accept": "message/rfc2822"
        }
    }).auth("api", MAILGUN_API_KEY)
    ffile.on('data', (s => {
    }))
    ffile
        .pipe(
            uploadFile.createWriteStream({
                metadata: {
                    contentType: attachmentContentType,
                    metadata: {
                        custom: "metadata"
                    }
                },
                validation: "md5"
            })
        )
        .on("error", (err) => {
            console.log(err)
        })
        .on("finish", () => {
            console.log("Upload finished")
            uploadFile
                .getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                })
                .then(signedUrl => {
                    console.log(signedUrl)

                    updateDB(subject, signedUrl, attachmentName, 69)
                })
                .catch(err => {
                    console.log(err)
                })
        })

    res.send("Recieved message! Thank you mailgun :)")

})


function updateDB(subject, ourfileUrl, attachmentName, ourfileSize) {
    console.log("UPDATE DB RUN")
    admin.firestore().settings({ timestampsInSnapshots: true })
    const usersRef = admin.firestore()
        .doc("users/" + subject);

    usersRef
        .get()
        .then(userDoc => {
            if (userDoc && userDoc.exists) {
                console.log("EXIST");
                usersRef
                    .update({
                        Files: admin.firestore().FieldValue.arrayUnion({
                            yourName: subject,
                            fileUrl: ourfileUrl,
                            fileTitle: attachmentName,
                            fileName: attachmentName,
                            fileSize: ourfileSize
                        })
                    })
                    .then(() => {
                        console.log("Status Updated");
                    })
                    .catch(error => {
                        console.log("Got an error: " + error);
                    });
            } else {
                console.log("NOT EXIST");
                usersRef
                    .set({
                        Files: [
                            {
                                yourName: subject,
                                fileUrl: ourfileUrl,
                                fileTitle: attachmentName,
                                fileName: attachmentName,
                                fileSize: ourfileSize
                            }
                        ],
                        name: subject
                    })
                    .then(() => {
                        console.log("Status Pushed");
                    })
                    .catch(error => {
                        console.log("Got an error: " + error);
                    });
            }
        })
        .catch(error => {
            console.log("ERROR IS: " + error);
        });
}


const api1 = functions.https.onRequest(app1)


module.exports = {
    api1
}
