import './courses.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { CourseCard } from '../../allPagesPaths';
import CustomHeading from '../../components/helpers/CustomHeading';
import { useTitle } from '../../components/helpers/useTitle';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Courses = () => {

    // get the page title
    useTitle(`Courses`);

    const dispatch = useDispatch();

    const { playLists } = useSelector(state => state.playlists);

    /*=========================================*/

    useEffect(() => {

        dispatch(getAllPlaylists());

    }, [dispatch]);

    /*=========================================*/

    return (
        <div className='courses custom-div'>
            <div className="container p-0">
                <CustomHeading text="our courses" />
                <div className="courses-box">
                    <div className="row">
                        {
                            playLists?.length > 0 ?
                                playLists?.map(card => (
                                    <div className="col-lg-4 col-sm-6" key={card._id}>
                                        <CourseCard data={card} />
                                    </div>
                                ))
                                :
                                <h2 style={{ color: "var(--light-color)" }}>No Courses yet</h2>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses;