import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ValidationErrors from './ValidationErrors';


class CreateCourse extends Component {
    state = {
        title: null,
        description: null,
        estimatedTime: 'none',
        materialsNeeded: 'none',
        errors: null
    };

    createCourse = e => {
        e.preventDefault();
        const  id  = localStorage.getItem('_id');
        const { emailAddress, password } = localStorage;
        const { title, description, estimatedTime, materialsNeeded } = this.state;
        const { history } = this.props;
        console.log(this.state)

        axios
            .post(
                `http://localhost:5000/api/courses`,
                {
                    userId: id,
                    title: title,
                    description: description,
                    estimatedTime: estimatedTime,
                    materialsNeeded: materialsNeeded
                },
                {
                    auth: {
                        username: emailAddress,
                        password: password
                    }
                }
            )
            .then(() => {
                history.push('/');

            })
            .catch(err => {
                console.log(err.response)
                if (err.response.status === 400) {
                    const errors = err.response.data.Error;
                    const messages = Object.values(errors).map(err => {
                        return err.message;
                    });
                    this.setState({
                        errors: messages
                    });
                } else if (err.response.status === 500) {
                    history.push('/error');
                } else {
                    console.log('Error creating course', err);
                }
            });
    };

    // updates as there are changes!
    handleChange = e => {
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
    };

    // Displays erros upon validation for title and description
    render() {
        const { errors } = this.state;
        return (
                    <div>
                        <hr />
                        <div className="bounds course--detail">
                            <h1>Create Course</h1>
                            <div>
                                <ValidationErrors errors={errors} />
                                <form onSubmit={this.createCourse}>
                                    <div className="grid-66">
                                        <div className="course--header">
                                            <h4 className="course--label">Course</h4>
                                            <div>
                                                <input
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className="input-title course--title--input"
                                                    placeholder="Course title..."
                                                    onChange={this.handleChange}
                                                />
                                            </div>

                                            <p />
                                        </div>
                                        <div className="course--description">
                                            <div>
                        <textarea
                            id="description"
                            name="description"
                            className=""
                            placeholder="Course description..."
                            onChange={this.handleChange}
                        />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid-25 grid-right">
                                        <div className="course--stats">
                                            <ul className="course--stats--list">
                                                <li className="course--stats--list--item">
                                                    <h4>Estimated Time</h4>
                                                    <div>
                                                        <input
                                                            id="estimatedTime"
                                                            name="estimatedTime"
                                                            type="text"
                                                            className="course--time--input"
                                                            placeholder="Hours"
                                                            onChange={this.handleChange}
                                                        />
                                                    </div>
                                                </li>
                                                <li className="course--stats--list--item">
                                                    <h4>Materials Needed</h4>
                                                    <div>
                            <textarea
                                id="materialsNeeded"
                                name="materialsNeeded"
                                className=""
                                placeholder="List materials..."
                                onChange={this.handleChange}
                            />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="grid-100 pad-bottom">
                                        <button className="button" type="submit">
                                            Create Course
                                        </button>
                                        <NavLink to={'/'} className="button button-secondary">
                                            {' '}
                                            Cancel
                                        </NavLink>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
        );
    }
}

export default CreateCourse;