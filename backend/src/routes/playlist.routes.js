import { Router } from "express";

import {
  getAllPlaylist,
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongToPlayList,
} from "../controller/playlist.controller.js";
import checkPlaylistOwner from "../middleware/checkPlaylistOwner.js"

const router = Router();

router.get("/", getAllPlaylist);
router.post("/", createPlaylist);
router.get("/:playlistId",checkPlaylistOwner,getPlaylist);
router.put("/:playlistId",checkPlaylistOwner,updatePlaylist);
router.delete("/:playlistId",checkPlaylistOwner,deletePlaylist);
router.post("/:playlistId/songs",checkPlaylistOwner,addSongToPlaylist);
router.delete("/:playlistId/songs/:songId",checkPlaylistOwner,removeSongToPlayList);
export default router;
