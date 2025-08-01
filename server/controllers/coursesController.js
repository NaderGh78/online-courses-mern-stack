const asyncHandler = require("express-async-handler");
const { PlaylistModel } = require("../models/PlaylistModel");
const { CourseModel } = require("../models/CourseModel");
const { validateCourse } = require("../models/CourseModel");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs = require("fs");
const { UserModel } = require("../models/UserModel");

/*=========================================*/
/*=========================================*/
/*=========================================*/

/**
 *@desc create course
 *@route /api/courses/:playlistId
 *@method Post
 *@access private(only theacher himself)
*/

const createCourseCtrl = asyncHandler(

  async (req, res) => {

    const playlistId = req.params.playlistId;

    // 1. Check if the playlist exists
    const playlist = await PlaylistModel.findById(playlistId);
    // console.log('Playlist Found:', playlist);

    if (!playlist) {

      return res.status(404).json({ message: "Playlist not found" });

    }

    // 2. Check if the user is the teacher of the playlist
    if (playlist.teacher.toString() !== req.userDecoded.id) {

      return res.status(403).json({ message: "Not authorized to add course to this playlist" });

    }

    // 3. Log incoming request body for debugging
    // console.log('Request Body:', req.body);
    // console.log('Video Link:', req.body.videoLink);

    // 3. Validate video link - Make sure it’s a valid URL
    const videoLinkRegex = /^https?:\/\/.+\..+/;

    if (!videoLinkRegex.test(req.body.videoLink)) {

      return res.status(400).json({ message: "Invalid video link URL" });

    }

    // 4. Validate course data
    const courseData = {

      videoTitle: req.body.videoTitle,

      videoLink: req.body.videoLink

    };

    const { error } = validateCourse(courseData);

    if (error) {

      return res.status(400).json({ message: error.details[0].message });

    }

    // 5. Check if the course title already exists in the playlist
    const existingCourse = await CourseModel.findOne({
      videoTitle: req.body.videoTitle,
      playlist: playlistId
    });

    if (existingCourse) {

      return res.status(400).json({ message: "Video title already exists!" });

    }

    // 6. Handle image upload (Cloudinary)
    let tutorialImage = {
      url: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
      publicId: null
    };

    if (req.file) {

      // console.log('File Upload:', req.file);

      const uploaded = await cloudinaryUploadImage(req.file.path);

      fs.unlinkSync(req.file.path);

      tutorialImage = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id
      };

    }

    // 7. Create the new course
    const newCourse = await CourseModel.create({
      playlist: playlistId,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      tutorialImage,
      teacher: req.userDecoded.id
    });

    // 8. Update the playlist's courses array
    await PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $push: { courses: newCourse._id } },
      { new: true } // Return the updated playlist
    );

    // 9. Send success response
    res.status(201).json({
      message: "Course created successfully",
      data: newCourse,
      success: true,
    });
  }
);

/*=========================================*/

/**
 *@desc get all courses
 *@route /api/courses/:playlistId
 *@method Get
 *@access public 
*/

const getAllCoursesCtrl = asyncHandler(

  async (req, res) => {

    const playlist = await PlaylistModel.findOne({

      _id: req.params.playlistId, // Only filter by playlistId

    }).populate({
      path: "courses",
      populate: {
        path: "playlist", // Populate the "playlist" field in each course
        select: "title"  // Only get the title
      },
    }).populate('comment');

    if (!playlist) {

      return res.status(404).json({ message: "Playlist doesn't exist!" });

    }

    res.status(200).json(playlist.courses);

  });

/*=========================================*/

/**
 *@desc get single course
 *@route /api/courses/:playlistId/:courseId
 *@method Get
 *@access public 
*/

const getSingleCourseCtrl = asyncHandler(

  async (req, res) => {

    const { playlistId, courseId } = req.params;

    try {

      // 1. Fetch the course by courseId and playlistId
      const course = await CourseModel.findOne({
        _id: courseId,
        playlist: playlistId,
      }).populate('teacher', 'username profilePhoto role')
        .populate('comment');

      if (!course) {

        return res.status(404).json({ message: "Course not found!" });

      }

      // 2. Check if teacher details are populated correctly
      if (!course.teacher) {

        return res.status(404).json({ message: "Teacher not found for this course!" });

      }

      // 3. Send the populated course with teacher details
      res.status(200).json(course);

    } catch (error) {

      console.error("Error in getSingleCourseCtrl:", error);

      res.status(500).json({ message: "Internal server error", error: error.message });

    }

  }

);

/*=========================================*/

/**
 *@desc edit course
 *@route /api/courses/:playlistId/:courseId
 *@method Put
 *@access private(only theacher himself) 
*/

const editCourseCtrl = asyncHandler(

  async (req, res) => {

    const { playlistId, courseId } = req.params;

    const { videoTitle, videoLink, playlist: newPlaylistId } = req.body;

    try {

      // Find the course
      const course = await CourseModel.findOne({
        _id: courseId,
        playlist: playlistId // Ensure the course belongs to the original playlist
      });

      if (!course) {

        return res.status(404).json({ message: "Course not found in this playlist!" });

      }

      // Update the course fields
      if (videoTitle) course.videoTitle = videoTitle;

      if (videoLink) course.videoLink = videoLink;

      // Handle playlist change
      if (newPlaylistId && newPlaylistId !== course.playlist.toString()) {

        // Remove the course from the previous playlist
        await PlaylistModel.findByIdAndUpdate(
          playlistId,
          { $pull: { courses: courseId } }, // Remove course from previous playlist
          { new: true }
        );

        // Add the course to the new playlist
        await PlaylistModel.findByIdAndUpdate(
          newPlaylistId,
          { $addToSet: { courses: courseId } }, // Add course to new playlist
          { new: true }
        );

        // Update the course's playlist field
        course.playlist = newPlaylistId;

      }

      // Handle image upload if a new image is provided
      if (req.file) {

        const uploadedImage = await cloudinaryUploadImage(req.file.path);

        fs.unlinkSync(req.file.path); // Delete the temporary file

        // Update the tutorialImage field
        course.tutorialImage = {

          url: uploadedImage.secure_url,

          publicId: uploadedImage.public_id

        };

      }

      // Save the updated course
      const updatedCourse = await course.save();

      // Send success response
      res.status(200).json({
        message: "Course updated successfully!",
        data: updatedCourse,
      });

    } catch (error) {

      res.status(500).json({ message: "Internal server error", error: error.message });

    }

  }

);

/*=========================================*/

/**
 *@desc delete single course
 *@route /api/courses/:playlistId/:courseId
 *@method Delete
 *@access private(only theacher himself) 
*/

const deleteSingleCourseCtrl = asyncHandler(

  async (req, res) => {

    const { playlistId, courseId } = req.params;

    const course = await CourseModel.findOne({
      _id: courseId,
      playlist: playlistId,
    });

    if (!course) {

      return res.status(404).json({ message: "Course not found" });

    }

    // Delete course
    await CourseModel.findByIdAndDelete(courseId);

    // Remove course ID from playlist.courses array
    await PlaylistModel.findByIdAndUpdate(playlistId, {
      $pull: { courses: courseId },
    });

    res.status(200).json({ message: "Course deleted successfully" });

  }

);

/*=========================================*/

/**
 *@desc make like on video
 *@route /api/courses/:courseId/like
 *@method Post
 *@access private(only login user) 
*/

const addLikeOnCourseCtrl = asyncHandler(async (req, res) => {

  const { courseId } = req.params;

  const userId = req.userDecoded.id;

  const course = await CourseModel.findById(courseId);

  if (!course) {

    return res.status(400).json({ message: "This course doesn't exist!" });

  }

  const alreadyLiked = course.likes.includes(userId);

  if (alreadyLiked) {

    course.likes.pull(userId); // Remove like

  } else {

    course.likes.push(userId); // Add like

  }

  await course.save();

  res.status(200).json({
    success: true,
    message: alreadyLiked ? "Like removed" : "Like added",
    likes: course.likes
  });

}

);

/*=========================================*/

module.exports = {
  createCourseCtrl,
  getAllCoursesCtrl,
  getSingleCourseCtrl,
  editCourseCtrl,
  deleteSingleCourseCtrl,
  addLikeOnCourseCtrl
}; 