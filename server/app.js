const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./config/db');
const AuthPath = require("./routes/authRoute");
const UsersPath = require("./routes/usersRoute");
const PlaylistPath = require("./routes/PlaylistRoute");
const CoursePath = require("./routes/coursesRoute");
const CommentPath = require("./routes/commentRoute");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

/*=========================================*/

// routes 
app.use("/api/auth", AuthPath);
app.use("/api/users", UsersPath);
app.use("/api/playlists", PlaylistPath);
app.use("/api/courses", CoursePath);
app.use("/api/comments", CommentPath);

/*=========================================*/

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
    console.log(`the server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
}); 