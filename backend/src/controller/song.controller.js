import { z } from "zod";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import Song from "../models/song.model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

const querySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});
export const getAllSongs = async (req, res, next) => {
  try {
    const result = querySchema.safeParse({
      page: req.query.page,
      limit: req.query.limit,
    });

    if (!result.success) {
      return next(result.error);
    }

    const { page, limit } = result.data;

    const skip = (page - 1) * limit;

    const songs = await Song.find({})
      .select("-uploadedBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalSongs = await Song.countDocuments();

    return res.status(200).json({
      success: true,

      msg:
        songs.length > 0
          ? "Songs retrieved successfully"
          : "No songs available currently",

      currentPage: page,

      totalSongs,

      hasMore: skip + songs.length < totalSongs,

      data: songs,
    });
  } catch (error) {
    return next(error);
  }
};

const idSchema = z.string().trim();
export const getSong = async (req, res, next) => {
  const result = idSchema.safeParse(req.params.songId);
  if (!result.success) {
    return next(result.error);
  }

  const songId = result.data;

  if (!mongoose.isValidObjectId(songId)) {
    const error = new Error("invalid songId format");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const song = await Song.findById(songId).select("-uploadedBy");
    if (!song) {
      const error = new Error("Song not found");
      error.statusCode = 404;
      return next(error);
    }
    return res.status(200).json({
      success: true,
      msg: "song retrieved successfully",
      data: song,
    });
  } catch (error) {
    return next(error);
  }
};

const addSongSchema = z.object({
  title: z
    .string()
    .min(2, { message: "title name must be atleast 2 character" })
    .max(20, { message: "title name max lenght is 20, character" })
    .trim(),
  artist: z
    .string()
    .min(2, { message: "artist name must be atleast 2 character" })
    .max(20, { message: "artist name max lenght is 20, character" })
    .trim(),
  album: z
    .string()
    .max(20, { message: "album name max lenght is 20, character" })
    .trim(),
  genre: z
    .string()
    .max(20, { message: "genre name max lenght is 20, character" })
    .trim(),
});
export const addSong = async (req, res, next) => {
  const adminId = req.userId;

  const result = addSongSchema.safeParse(req.body);
  if (!result.success) {
    return next(result.error);
  }

  if (!req.files.coverImage || !req.files.song) {
    const error = new Error("coverImage or song don't receive");
    error.statusCode = 400;
    return next(error);
  }

  let songResult;
  let imageResult;

  try {
    [songResult, imageResult] = await Promise.all([
      uploadToCloudinary(
        req.files.song[0].buffer,
        "SoundSphere/songs",
        "video",
      ),
      uploadToCloudinary(
        req.files.coverImage[0].buffer,
        "SoundSphere/covers",
        "image",
      ),
    ]);
  } catch (error) {
    console.log(error);
    const err = new Error("unable to send coverImage or song to cloud storage");
    err.statusCode = 500;
    return next(err);
  }

  try {
    let { title, artist, album, genre } = result.data;
    if (!album) {
      album = "Unknown Album";
    }

    if (!genre) {
      genre = "Unknown Genre";
    }

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      coverImage: {
        url: imageResult.secure_url,
        public_id: imageResult.public_id,
      },
      songUrl: {
        url: songResult.secure_url,
        public_id: songResult.public_id,
      },
      duration: Number(songResult.duration),
      uploadedBy: adminId,
    });

    return res.status(201).json({
      success: true,
      msg: "Song added successfully",
      data: song,
    });
  } catch (error) {
    try {
      const [deleteSong,deleteImage] = await Promise.all([
         cloudinary.uploader.destroy(songResult.public_id, {
          resource_type: "video",
        }),
        cloudinary.uploader.destroy(imageResult.public_id)
      ])
    } catch (error) {
      console.log(error)
    }
    return next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  const result = idSchema.safeParse(req.params.songId);
  if (!result.success) {
    return next(result.error);
  }

  const songId = result.data;

  if (!mongoose.isValidObjectId(songId)) {
    const error = new Error("invalid songId format");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const existingSong =
      await Song.findById(songId).select("coverImage songUrl");

    if (!existingSong) {
      const error = new Error("song not found");
      error.statusCode = 404;
      return next(error);
    }
    const deletedSong = await Song.findByIdAndDelete(songId);
    if (!deletedSong) {
      const error = new Error("The song meant to be deleted was not found");
      error.statusCode = 404;
      return next(error);
    }
    if (existingSong.coverImage?.public_id) {
      await cloudinary.uploader.destroy(existingSong.coverImage.public_id);
    }
    if (existingSong.songUrl?.public_id) {
      await cloudinary.uploader.destroy(existingSong.songUrl.public_id, {
        resource_type: "video",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "song deleted successfully",
      data: deletedSong,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const updateSongSchema = z.object({
  title: z
    .string()
    .max(20, { message: "title name max lenght is 20, character" })
    .trim()
    .optional(),
  artist: z
    .string()
    .max(20, { message: "artist name max lenght is 20, character" })
    .trim()
    .optional(),
  album: z
    .string()
    .max(20, { message: "album name max lenght is 20, character" })
    .trim()
    .optional(),
  genre: z
    .string()
    .max(20, { message: "genre name max lenght is 20, character" })
    .trim()
    .optional(),
});

export const updateSong = async (req, res, next) => {
  const result = idSchema.safeParse(req.params.songId);
  if (!result.success) {
    return next(result.error);
  }

  const songId = result.data;

  if (!mongoose.isValidObjectId(songId)) {
    const error = new Error("invalid songId format");
    error.statusCode = 400;
    return next(error);
  }

  const updateSongResult = updateSongSchema.safeParse(req.body);
  if (!updateSongResult.success) {
    return next(updateSongResult.error);
  }
  const updateData = {};
  try {
    const existingSong = await Song.findById(songId);
    if (!existingSong) {
      const error = new Error("song not found");
      error.statusCode = 404;
      return next(error);
    }

    const allowedFields = ["title", "artist", "album", "genre"];

    for (const fields of allowedFields) {
      if (req.body[fields]?.trim()) {
        updateData[fields] = req.body[fields].trim();
      }
    }

    if (req.files?.coverImage) {
      try {
        const imageResult = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          "SoundSphere/covers",
          "image",
        );

        updateData.coverImage = {
          url: imageResult.secure_url,
          public_id: imageResult.public_id,
        };
      } catch (error) {
        console.log(error);
        const err = new Error("unable to send coverImage to cloud storage");
        err.statusCode = 500;
        return next(err);
      }
    }

    if (req.files?.song) {
      try {
        const songResult = await uploadToCloudinary(
          req.files.song[0].buffer,
          "SoundSphere/songs",
          "video",
        );
        updateData.songUrl = {
          url: songResult.secure_url,
          public_id: songResult.public_id,
        };
        updateData.duration = Number(songResult.duration);
      } catch (error) {
        console.log(error);
        const err = new Error("unable to send song to cloud storage");
        err.statusCode = 500;
        return next(err);
      }
    }

    const song = await Song.findByIdAndUpdate(
      songId,
      { $set: updateData },
      { new: true },
    );

    if (!song) {
      const error = new Error("Song is not found");
      error.statusCode = 400;
      return next(error);
    }

    if (req.files?.coverImage) {
      await cloudinary.uploader.destroy(existingSong.coverImage.public_id);
    }

    if (req.files?.song) {
      await cloudinary.uploader.destroy(existingSong.songUrl.public_id, {
        resource_type: "video",
      });
    }

    return res.status(200).json({
      success: true,
      data: song,
      msg: "song updated successfully",
    });
  } catch (error) {
    try {
      if (req.files?.coverImage) {
        await cloudinary.uploader.destroy(updateData.coverImage.public_id);
      }

      if (req.files?.song) {
        await cloudinary.uploader.destroy(updateData.songUrl.public_id, {
          resource_type: "video",
        });
      }
    } catch (error) {
      console.log(error);
      const err = new Error("unable to delete coverImage or song");
      err.statusCode = 500;
      return next(err);
    }
    return next(error);
  }
};

const searchSchema = z.object({
  query: z.string().trim().min(1).max(20),

  page: z.coerce.number().positive().default(1),

  limit: z.coerce.number().positive().max(100).default(10),
});
export const searchSong = async (req, res, next) => {
  const result = searchSchema.safeParse({
    query: req.query.query,
    page: req.query.page,
    limit: req.query.limit,
  });

  if (!result.success) {
    return next(result.error);
  }

  try {
    const { query, page, limit } = result.data;
    const searchFilter = {
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },
        {
          artist: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    };

    const skip = (page - 1) * limit;
    const searchSongs = await Song.find(searchFilter)
      .select("-uploadedBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalSongs = await Song.countDocuments(searchFilter);

    return res.status(200).json({
      success: true,
      msg:
        searchSongs.length > 0
          ? "searched song successfully found"
          : "No songs found",
      data: searchSongs,
      hasMore: skip + searchSongs.length < totalSongs,
      pageNumber: page,
      totalSongs,
    });
  } catch (error) {
    return next(error);
  }
};

export const incrementPlayCount = async (req, res, next) => {
  const result = idSchema.safeParse(req.params.songId);
  if (!result.success) {
    return next(result.error);
  }
  const songId = result.data;
  if (!mongoose.isValidObjectId(songId)) {
    const error = new Error("invalid songId formate");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const updatedSongCounter = await Song.findByIdAndUpdate(
      songId,
      {
        $inc: {
          playCount: 1,
        },
      },
      {
        new: true, 
      },
    );

    if (!updatedSongCounter) {
       const error = new Error("song not found")
       error.statusCode = 404
       return next(error)
    }

    return res.status(200).json({
      success : true,
      msg : 'song playCount updated successfully'
    })
  } catch (error) {
    return next(error)
  }
};
