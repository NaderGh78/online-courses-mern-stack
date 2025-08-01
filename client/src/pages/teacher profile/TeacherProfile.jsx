import "./teacher-profile.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/apiCalls/profileApiCall";
import { getTeacherPlaylists } from "../../redux/apiCalls/playListApiCall";
import { TeacherProfileBttom, TeacherProfileTop } from "../../allPagesPaths";
import { useTitle } from "../../components/helpers/useTitle";
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TeacherProfile = () => {

    // get the page title
    useTitle(`Teacher Profile`);

    const dispatch = useDispatch();

    const { id } = useParams();

    const { profile, loading } = useSelector(state => state.profile);

    const { teacherPlaylists, totalCourses } = useSelector(state => state.playlists);

    /*=========================================*/

    // get single profile depend on id param
    useEffect(() => {

        dispatch(getProfile(id));

    }, [dispatch, id]);

    /*=========================================*/

    useEffect(() => {

        dispatch(getTeacherPlaylists(id));

    }, [dispatch, id]);

    /*=========================================*/

    if (loading) return <Spinner />;
    return (
        <div className="teacher-profile custom-div">
            <div className="teacher-profile-box">
                <div className="container p-0">
                    <TeacherProfileTop
                        profile={profile}
                        teacherPlaylistsLength={teacherPlaylists?.length || 0}
                        totalCourses={totalCourses}
                    />
                    <TeacherProfileBttom teacherPlaylists={teacherPlaylists} />
                </div>
            </div>
        </div>
    )
}

export default TeacherProfile;