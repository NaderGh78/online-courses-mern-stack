import './home.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { OurCourses, Quick } from '../../allPagesPaths';
import { useTitle } from '../../components/helpers/useTitle';
import Spinner from '../../components/common/spinner/Spinner';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Home = () => {

    // get the page title
    useTitle(`Online Courses`);

    const dispatch = useDispatch();

    const { playLists, playlistLoading } = useSelector(state => state.playlists);

    useEffect(() => {

        dispatch(getAllPlaylists());

    }, [dispatch]);

    /*=========================================*/

    if (playlistLoading) return <Spinner />;

    return (
        <div className='home custom-div'>
            <div className="container p-0">
                <Quick />
                <OurCourses playLists={playLists} />
            </div>
        </div>
    )
}

export default Home;