import CustomHeading from "../helpers/CustomHeading";
import { SingleTeacherCard } from '../../allPagesPaths';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TeacherProfileBttom = ({ teacherPlaylists }) => {

  return (
    <>
      <CustomHeading text="our courses" />
      <div className="teacher-profile-bottom">
        <div className="row">
          {
            teacherPlaylists?.length > 0
              ?
              teacherPlaylists?.map(card => (
                <div className="col-lg-4 col-sm-6" key={card._id}>
                  <SingleTeacherCard data={card} />
                </div>
              ))
              :
              <h1>No courses for this teacher</h1>
          }
        </div>
      </div>
    </>
  )
}

export default TeacherProfileBttom;