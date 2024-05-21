import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

const uid = 'svzsUSB4dxNTA23eULPRvxNkdnn2'; 

auth.setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Custom claims set for user');
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
  });
