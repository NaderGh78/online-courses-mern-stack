import axios from "axios";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const localy = "http://localhost:3001";

const production = "https://online-courses-mern-stack.onrender.com";

const request = axios.create({
    baseURL: localy
});

export default request;