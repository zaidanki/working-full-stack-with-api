import React from 'react';
import {NavLink} from "react-router-dom";

// This will appear if user tried to get into a link they are not authed to get to (update/delete)
const Forbidden = () => {
    return (
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>
                Oh oh! You can't access this page.
            </p>
            <NavLink to={'/'}>
                Click Here to go back!
            </NavLink>
        </div>
    );
};
export default Forbidden;