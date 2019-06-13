import React from 'react';
import {NavLink} from "react-router-dom";

// When a url that does not exist is entered this page will show.
const NotFound = () => {
    return (
        <div className="bounds">
            <h1>Not Found</h1>
            <p>Sorry! We couldn't find the page you're looking for.</p>
            <NavLink to={'/'}> Click Here to go Back to main menu!</NavLink>
        </div>
    );
};

export default NotFound;