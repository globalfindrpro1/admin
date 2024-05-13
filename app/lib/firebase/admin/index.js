import admin from 'firebase-admin';
import { fireConfig } from './fireConfig'

// if (!admin.apps.length) {
//     admin.initializeApp({
//         credential: admin.credential.cert(fireConfig),
//     });
// }

// export default admin;

import { getApps, initializeApp } from "firebase-admin/app";

const alreadyCreatedAps = getApps();
const yourFirebaseAdminConfig= {
    credential: admin.credential.cert(fireConfig),
}

const app =
  alreadyCreatedAps.length === 0
    ? initializeApp({yourFirebaseAdminConfig}, "events app")
    : alreadyCreatedAps[0];

export default app;
