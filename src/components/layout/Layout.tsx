import Navbar from './Navbar';
import {Outlet} from "react-router";



export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Outlet></Outlet>
        </div>
    );
}