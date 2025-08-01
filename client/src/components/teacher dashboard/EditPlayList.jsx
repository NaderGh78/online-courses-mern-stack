import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getSinglePlaylist, updatePlaylist } from "../../redux/apiCalls/playListApiCall";
import { useTitle } from '../../components/helpers/useTitle';
import { ToastContainer } from 'react-toastify';
import Spinner from "../common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const EditPlayList = () => {

    useTitle(`Edit Playlist`);

    const { id } = useParams();

    const dispatch = useDispatch();

    const { playlistLoading, singlePlayList } = useSelector(state => state.playlists);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [category, setCategory] = useState("");

    const [file, setFile] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    const [localLoading, setLocalLoading] = useState(true)

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

        dispatch(getSinglePlaylist(id));

    }, [dispatch, id]);

    /*=========================================*/

    useEffect(() => {

        if (singlePlayList) {

            setLocalLoading(false);

            setTitle(singlePlayList.title || "");

            setDescription(singlePlayList.description || "");

            setCategory(singlePlayList.category || "");

            setImagePreview(singlePlayList.mainPlaylistImage?.url);
        }

    }, [singlePlayList]);

    /*=========================================*/

    const editPlayListHandler = (e) => {

        e.preventDefault();

        var formData = new FormData();

        formData.append("title", title);

        formData.append("description", description);

        formData.append("category", category);

        file && formData.append("mainPlaylistImage", file);

        dispatch(updatePlaylist(singlePlayList?._id, formData));

    }

    /*=========================================*/

    if (localLoading) return <Spinner />;

    return (
        <div className="edit-playlist">
            <div className="form-box">
                <h3>Edit Playlist</h3>
                <form onSubmit={editPlayListHandler}>
                    <label htmlFor="category">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select category</option>
                        <option value="Html">Html</option>
                        <option value="javaScript">javaScript</option>
                        <option value="Css">Css</option>
                    </select>

                    <div className="form-group">
                        <label htmlFor="title">
                            Title <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group file-input">
                        <label htmlFor="main-image">
                            Playlist Image <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            className="form-control-file"
                            id="main-image"
                            onChange={handleFileChange}
                        />
                        {imagePreview && (
                            <div className="my-4">
                                <img
                                    src={imagePreview}
                                    alt="Playlist Preview"
                                    className="rounded-lg"
                                    style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="tutorial-desc">
                            Description  <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control my-textarea"
                            rows={5}
                            id="tutorial-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="custom-link border-0"
                        style={{ height: "42px" }}
                    >
                        {playlistLoading
                            ?
                            <>
                                <div
                                    className="spinner-border"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        borderWidth: "2px",
                                        color: "#fff"
                                    }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </>
                            :
                            "Edit Playlist"
                        }
                    </button>
                </form>
            </div>
            <ToastContainer autoClose={6000} />
        </div>
    )
}

export default EditPlayList;