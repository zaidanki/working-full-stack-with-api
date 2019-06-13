import React, { Component } from 'react';
import axios from 'axios';

import Course from './Course';
import {NavLink} from "react-router-dom";
import {AuthConsumer} from "./Authenticator";

class Courses extends Component {
    state = {
        courses: {}
    };

    componentDidMount() {
        this.getDataOnLoad();
    }

    getDataOnLoad = () => {
        axios
            .get(`http://localhost:5000/api/courses`)
            .then(response => {
                this.setState({
                    courses: response.data
                });
            })
            .catch(err => {
                console.log('Error fetching courses', err);
            });
    };

    render() {
        // this displays the list of courses with the add course button!
        const { courses } = this.state;

        return (
                    <div>
                        <hr />
                        <div>
                            {Object.keys(courses).map(key => {
                                return (
                                    <Course
                                        title={courses[key].title}
                                        key={key}
                                        index={key}
                                        id={courses[key].id}
                                        courseUserId={courses[key].userId}
                                    />
                                );
                            })}
                            <AuthConsumer>
                                {({ isAuth }) => (
                                    <div className="grid-33">
                                                {isAuth ? (

                                                    <NavLink className="course--module course--add--module"
                                  to="/courses/create">
                                <h3 className="course--add--title">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                         viewBox="0 0 13 13" className="add">
                                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                                    </svg>
                                    New Course
                                </h3>
                            </NavLink>
                                                ) : null}
                                    </div>
                                                )}
                            </AuthConsumer>

                        </div>
                    </div>
                )
    }
}

export default Courses;