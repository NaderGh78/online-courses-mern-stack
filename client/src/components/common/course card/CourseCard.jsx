import './course-card.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hidePopUp } from '../../../redux/slices/popUpSlice';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CourseCard = ({ data: {
  _id,
  teacher,
  createdAt,
  mainPlaylistImage,
  title,
  coursesCount }
}) => {

  const dispatch = useDispatch();

  /*=========================================*/

  const hidePopUpHandler = () => {
    dispatch(hidePopUp());
  };

  /*=========================================*/

  return (
    <div className='course-card'>
      <div className="top user-avatar-details">
        <div className="left">
          <img
            src={teacher?.profilePhoto?.url}
            alt="teacher"
          />
        </div>
        <div className="right">
          <Link><h6>{teacher?.username}</h6></Link>
          <span style={{ color: "var(--light-color)", fontSize: "1.3rem" }}>
            {createdAt?.slice(0, 10)}
          </span>
        </div>
      </div>
      <div className="thumb-box">
        <img
          src={mainPlaylistImage?.url}
          className='img-fluid'
          alt="single course"
        />
        <span style={{ fontSize: "1.5rem" }}>
          {coursesCount || 0} videos
        </span>
      </div>
      <div className="bottom">
        <h5 style={{ color: "var(--black)", marginBottom: "15px", fontSize: "2rem" }}>
          {title}
        </h5>
        <Link
          to={`/playlist-details/${_id}`}
          onClick={hidePopUpHandler}
          className='main-custom-link'
        >
          View Playlist
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 