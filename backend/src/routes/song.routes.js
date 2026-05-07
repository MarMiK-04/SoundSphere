import { Router } from "express";
import {
  getAllSongs,
  getSong,
  addSong,
  updateSong,
  deleteSong,
} from "../controller/song.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllSongs);
router.post("/",adminAuth, addSong);
router.get("/:songId", getSong);
router.put("/:songId", adminAuth, updateSong);
router.delete("/:songId",adminAuth,deleteSong);

export default router;
