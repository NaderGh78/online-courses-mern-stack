const Joi = require("joi");
const { Schema, model } = require("mongoose");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const teacherSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tutorialTitle: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: true,
        trim: true,
        unique: true
    },
    tutorialDescription: {
        type: String,
        minLength: 5,
        maxLength: 250,
        required: true,
        trim: true
    },
    videoLink: {
        type: String,
        minLength: 5,
        maxLength: 500, // URLs can be longer than 50 chars
        required: true,
        trim: true
    },
    videoTitle: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    videoDescription: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    category: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    mainPlaylistImage: {
        type: Object,
        default: {
            url: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
            publicId: null
        }
    },
    tutorialImage: {
        type: Object,
        default: {
            url: "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg",
            publicId: null,
        }
    }

}, { timestamps: true });

/*=========================================*/

function validatationNewCourse(obj) {

    const schema = Joi.object({

        TutorialTitle: Joi.string().min(5).max(50).required(),

        TutorialDescription: Joi.string().min(5).max(250).required(),

        videoLink: Joi.string().required(),

        videoTitle: Joi.string().min(5).max(150).required(),

        videoDescription: Joi.string().min(5).max(150).required(),

        category: Joi.string().min(5).max(150).required()

    });

    return schema.validate(obj);

}

/*=========================================*/

const TeacherModel = model("Teacher", teacherSchema);

/*=========================================*/

module.exports = {
    TeacherModel,
    validatationNewCourse
}; 