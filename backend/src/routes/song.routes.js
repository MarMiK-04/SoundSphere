import { Router } from "express";
import {
  getAllSongs,
  getSong,
  addSong,
  updateSong,
  deleteSong,
  searchSong,
} from "../controller/song.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.middleware.js";
const router = Router();

router.get("/", getAllSongs);
router.post(
  "/",
  adminAuth,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "song",
      maxCount: 1,
    },
  ]),
  addSong,
);
router.get("/search", searchSong);
router.get("/:songId", getSong);
router.put("/:songId", adminAuth, updateSong);
router.delete("/:songId", adminAuth, deleteSong);

export default router;
