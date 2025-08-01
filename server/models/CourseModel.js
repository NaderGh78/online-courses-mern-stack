const { Schema, model } = require("mongoose");
const Joi = require("joi");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const courseSchema = new Schema({
    playlist: {
        type: Schema.Types.ObjectId,
        ref: "Playlist"
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    comment: [
        { type: Schema.Types.ObjectId, ref: "Comment" }
    ],
    likes: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    videoTitle: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    tutorialImage: {
        type: Object,
        default: {
            url: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
            publicId: null
        }
    },
    videoLink: {
        type: String,
        minLength: 5,
        maxLength: 500,
        required: true,
        trim: true
    }

}, { timestamps: true });

/*=========================================*/

function validateCourse(obj) {

    const schema = Joi.object({

        // playlist: Joi.string().required(), // Playlist ID must be provided

        videoTitle: Joi.string().min(5).max(150).required(),

        // videoLink: Joi.string().uri().min(5).max(500).required(),
        videoLink: Joi.string().min(5).max(500).required()

        // tutorialImage is handled in multer & cloudinary

    })

    return schema.validate(obj)

}

/*=========================================*/

const CourseModel = model("Course", courseSchema);

/*=========================================*/

module.exports = {
    CourseModel,
    validateCourse
}; 