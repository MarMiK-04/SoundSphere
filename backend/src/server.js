import "./config/env.js"
import authRoutes from "./routes/auth.routes.js"
import songRoutes from "./routes/song.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import getLikedSongs from "./controller/like.controller.js"
import express from "express"
import cors from "cors"
import authMiddleware from "./middleware/authMiddleware.js"
import connectDB from "./config/db.js"
import errorHandler from "./middleware/errorHandler.js"
const app = express()
app.use(express.json())
app.use(cors())
connectDB()

app.use("/api/auth",authRoutes)
app.use(authMiddleware)
app.use("/api/songs",songRoutes)
app.use("/api/playlists",playlistRoutes)
app.get("/api/liked",getLikedSongs)

app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log(`server is listining on port ${process.env.PORT}`)
})