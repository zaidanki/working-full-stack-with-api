import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

import { AuthConsumer } from "./Authenticator";

class Course extends  Component {
    render() {
        const { id, title, courseUserId } = this.props;


        return (
            // checks if course is owner to display the (delete/update)
            <AuthConsumer>
                {({ isCourseOwner }) => (
                    <div className="grid-33">
                        <NavLink
                            to={`courses/${id}`}
                            className="course--module course--link"
                            onClick={isCourseOwner(courseUserId)}
                        >
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{title}</h3>
                        </NavLink>
                    </div>
                )}
            </AuthConsumer>
        );
    }
                }
                export default  React.memo(Course)