export const getAllSongs = async () => {};

export const getSong = async () => {};

export const addSong = async (req,res,next) => {
    try {
        const {title,artist,album,genre,duration} =  req.body
        const coverImage = req.files.coverImage[0]
        const song = req.files.song[0]
        return res.status(200).json({
            success : true,
            msg : "data received",
            data : {
                title,
                artist,
                album,
                genre,
                duration,
                coverImage : coverImage.originalname,
                song : song.originalname
            }
        })
    } catch (error) {
        const err = new Error("data not received")
        err.statusCode = 400
        next(err)
    }
};

export const deleteSong = async () => {};

export const updateSong = async () => {};

export const searchSong = async () => {};
