const admin = require('firebase-admin');

// FIREBASE ADMIN SDK
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
});

exports.firestore = admin.firestore();
