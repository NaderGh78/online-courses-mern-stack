import "./admin.css";
import { Link, Outlet, useLocation } from "react-router-dom";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Admin = () => {

    const { pathname } = useLocation();

    /*=========================================*/

    return (
        <div className="admin custom-div">
            <div className="container p-0">
                <ul className="d-flex gap-5" style={{ overflowX: "auto" }}>
                    <li>
                        <Link
                            to={"/admin"}
                            className={`${pathname === "/admin" ? "active" : ""}`}
                        >Teachers</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/students"}
                            className={`${pathname === "/admin/students" ? "active" : ""}`}>Students</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/other"}
                            className={`${pathname === "/admin/other" ? "active" : ""}`}>Other</Link>
                    </li>
                    <li>
                        <Link
                            to={"/admin/category"}
                            className={`${pathname === "/admin/category" ? "active" : ""}`}>Category</Link>
                    </li>
                </ul>
                <Outlet />
            </div>
        </div>
    )
}

export default Admin;