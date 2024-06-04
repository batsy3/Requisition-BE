import { Request, Response } from "express";
import { db } from "../firebase";
import * as admin from "firebase-admin";

admin.initializeApp();

export const handleCreateUser = async (
  request: Request,
  response: Response
) => {
  try {
    const data = request.body;
    const docRef = await db.collection("users").add(data);
    response.status(201).send({ id: docRef.id });
  } catch (error) {
    response.status(500).send({ error: "Failed to create user" });
  }
};

// Read (GET)
export const handleReadUserById = async (
  request: Request,
  response: Response
) => {
  try {
    const id = request.query.id as string;
    const doc = await db.collection("users").doc(id).get();
    if (doc.exists) {
      response.status(200).send(doc.data());
    } else {
      response.status(404).send({ error: "user not found" });
    }
  } catch (error) {
    response.status(500).send({ error: "Failed to read user" });
  }
};
//  read All Users
export const handleReadAllUser = async (
  request: Request,
  response: Response
) => {
  try {
    const doc = await db.collection("users").get();
    response.status(200).send(doc);
  } catch (error) {
    response.status(500).send({ error: "Failed to read All users" });
  }
};

// Update (PUT)
export const handleUpdateUser = async (
  request: Request,
  response: Response
) => {
  try {
    const id = request.query.id as string;
    const data = request.body;
    await db.collection("users").doc(id).set(data, { merge: true });
    response.status(200).send({ success: true });
  } catch (error) {
    response.status(500).send({ error: "Failed to update user" });
  }
};

// Delete (DELETE)
export const handleDeleteUser = async (
  request: Request,
  response: Response
) => {
  try {
    const id = request.query.id as string;
    await db.collection("users").doc(id).delete();
    response.status(200).send({ success: true });
  } catch (error) {
    response.status(500).send({ error: "Failed to delete user" });
  }
};
