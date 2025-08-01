import './home.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { OurCourses, Quick } from '../../allPagesPaths';
import { useTitle } from '../../components/helpers/useTitle';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Home = () => {

    // get the page title
    useTitle(`Online Courses`);

    const dispatch = useDispatch();

    const { playLists } = useSelector(state => state.playlists);

    useEffect(() => {

        dispatch(getAllPlaylists());

    }, [dispatch]);

    /*=========================================*/

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