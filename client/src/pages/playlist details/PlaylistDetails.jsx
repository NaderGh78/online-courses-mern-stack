import "./playlist-details.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesFromPlaylist } from "../../redux/apiCalls/coursesApiCall";
import { getSinglePlaylist } from "../../redux/apiCalls/playListApiCall";
import { PlayListBox, PlaylistVideos } from "../../allPagesPaths";
import { useTitle } from "../../components/helpers/useTitle";
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const PlaylistDetails = () => {

    useTitle(`Playlist`);

    const { id } = useParams();

    const dispatch = useDispatch();

    // Get playlist and courses state
    const { allCourses } = useSelector(state => state.courses);

    const [isLoading, setIsLoading] = useState(true);

    /*=========================================*/

    useEffect(() => {

        const fetchData = async () => {

            try {

                setIsLoading(true);

                // Fetch playlist and courses
                await Promise.all([
                    dispatch(getSinglePlaylist(id)),
                    dispatch(getAllCoursesFromPlaylist(id)),
                ]);

            } catch (error) {

                console.error("Error fetching data:", error);

            } finally {

                setIsLoading(false);

            }

        };

        if (id) {
            fetchData();
        }

    }, [dispatch, id]);

    /*=========================================*/

    if (isLoading) return <Spinner />;

    return (
        <div className='playlist-details custom-div'>
            <div className="container p-0">
                <PlayListBox id={id} courseCount={allCourses.length} playlistId={id} />
                <PlaylistVideos allCourses={allCourses} playlistId={id} />
            </div>
        </div>
    );
};

export default PlaylistDetails;