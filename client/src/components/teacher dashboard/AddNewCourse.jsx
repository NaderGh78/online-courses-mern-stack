import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlaylists, getTeacherPlaylists } from "../../redux/apiCalls/playListApiCall";
import { addNewCourse } from "../../redux/apiCalls/coursesApiCall";
import { useTitle } from "../helpers/useTitle";
import { ToastContainer, toast } from "react-toastify";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AddNewCourse = () => {

  // set page title
  useTitle(`New Course`);

  const dispatch = useDispatch();

  // redux states
  const { playLists, teacherPlaylists, playlistLoading } = useSelector((state) => state.playlists);

  const { currentUser } = useSelector((state) => state.auth);

  const { courseLoading } = useSelector((state) => state.courses);

  // component states
  const [videoTitle, setVideoTitle] = useState("");

  const [videoLink, setVideoLink] = useState("");

  const [playlistId, setPlaylistId] = useState("");

  const [file, setFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const [teacherPlaylistId, setTeacherPlaylistId] = useState("");

  /*=========================================*/

  // fetch playlists on component mount
  useEffect(() => {

    dispatch(getAllPlaylists());

  }, [dispatch]);

  /*=========================================*/

  const handleFileChange = (e) => {

    const selectedFile = e.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);

      setImagePreview(URL.createObjectURL(selectedFile));

    }

  };

  /*=========================================*/

  useEffect(() => {

    if (currentUser?._id) {

      dispatch(getTeacherPlaylists(currentUser?._id));

    }

  }, [dispatch, currentUser?._id]);

  /*=========================================*/

  const addNewCourseHandler = (e) => {

    e.preventDefault();

    // validate playlist selection
    if (!playlistId) {

      toast.error("No playlist selected! Please choose one.");

      return;

    }

    const formData = new FormData();

    formData.append("videoTitle", videoTitle);

    formData.append("videoLink", videoLink);

    file && formData.append("tutorialImage", file);

    dispatch(addNewCourse(playlistId, formData)).then((res) => {

      if (res?.success) {

        setVideoTitle("");

        setVideoLink("");

        setFile(null);

        setImagePreview(null);

        setTeacherPlaylistId("");

        setPlaylistId("");

      }

    });

  };

  /*=========================================*/

  return (
    <div className="add-new-course">
      <div className="form-box">
        <h3>New Course</h3>
        <form onSubmit={addNewCourseHandler}>
          {/* Course Title */}
          <div className="form-group">
            <label htmlFor="course-title">
              Course Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="course-title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter course title"

            />
          </div>

          {/* Course Video Link */}
          <div className="form-group">
            <label htmlFor="course-video-link">
              Course Video Link <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="course-video-link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="Enter video link"

            />
          </div>

          {/* Playlist Select */}
          <div className="form-group">
            <label htmlFor="select-playlist">
              Select Playlist <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="select-playlist"
              value={playlistId}
              onChange={(e) => setPlaylistId(e.target.value)}
            >
              <option value="">-- Select Playlist --</option>
              {playlistLoading ? (
                <option>Loading playlists...</option>
              ) : (
                teacherPlaylists?.length > 0 && teacherPlaylists?.map((playlist) => (
                  <option key={playlist._id} value={playlist._id}>
                    {playlist.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Course Image */}
          <div className="form-group file-input">
            <label htmlFor="course-image">
              Course Image <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              className="form-control-file"
              id="course-image"
              onChange={handleFileChange}
              accept="image/*"

            />
            {imagePreview && (
              <div className="my-4">
                <img
                  src={imagePreview}
                  alt="Course Preview"
                  className="rounded-lg"
                  style={{ width: "200px", height: "auto", objectFit: "cover" }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="custom-link border-0"
            style={{ height: "42px" }}
            disabled={courseLoading}
          >
            {courseLoading ? (
              <div
                className="spinner-border"
                style={{
                  width: "24px",
                  height: "24px",
                  borderWidth: "2px",
                  color: "#fff",
                }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Add Course"
            )}
          </button>
        </form>
      </div>
      <ToastContainer autoClose={6000} />
    </div>
  );
};

export default AddNewCourse;  