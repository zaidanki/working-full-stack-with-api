import React from 'react';
import {NavLink} from "react-router-dom";

// 500 errors
const UnhandledError = () => {
    return (
        <div className="bounds">
            <h1>Error</h1>
            <p>Sorry! this is a server side error! (500)</p>
            <NavLink to={'/'}> Click Here to go Back to main menu!</NavLink>
        </div>
    );
};

export default UnhandledError;