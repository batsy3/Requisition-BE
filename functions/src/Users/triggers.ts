import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const newUser = snap.data();
    console.log("New user created:", newUser);
    return newUser;
  });

export const onUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    console.log("User updated from", before, "to", after);
    return after;
  });

export const onUserDelete = functions.firestore
  .document("users/{userId}")
  .onDelete(async (snap, context) => {
    const deletedUser = snap.data();
    console.log("User deleted:", deletedUser);
    return deletedUser;
  });
