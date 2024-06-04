import * as functions from "firebase-functions";
import * as express from "express";
import {
  handleCreateUser,
  handleDeleteUser,
  handleReadAllUser,
  handleReadUserById,
  handleUpdateUser,
} from "./handlers";

const router = express.Router();

router.get("/", handleReadAllUser);
router.get("/:id", handleReadUserById);
router.post("/", handleCreateUser);
router.put("/:id", handleUpdateUser);
router.delete("/:id", handleDeleteUser);

export default router;
