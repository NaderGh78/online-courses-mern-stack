import axios from "axios";

/*===========================================*/
/*===========================================*/
/*===========================================*/

const baseURL =
    window.location.origin.includes("localhost")
        ? "http://localhost:3001"
        : window.location.origin;

const request = axios.create({ baseURL });

export default request;
