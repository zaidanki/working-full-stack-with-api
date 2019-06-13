import React, { Component } from 'react';
import axios from 'axios';
import { AuthConsumer } from "./Authenticator";
import { NavLink } from "react-router-dom";
import ReactMarkDown from "react-markdown"


class CourseDetail extends Component {

    state = {
        course: {},
        id: this.props.match.params.id,
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        name: '',
        userId: ''
    };

    componentDidMount() {
        this.getDetails()
        console.log(this.props)
    }

    getDetails = () => {
      axios.get(`http://localhost:5000/api/courses/${this.state.id}`).then(
          res => {
              console.log(res)
          this.setState({
              title: res.data.title,
              description: res.data.description,
              materialsNeeded: res.data.materialsNeeded,
              estimatedTime: res.data.estimatedTime,
              userId: res.data.userId
          })
          }
      ).then(this.getUser)
    };

    getUser = () => {
        // gets users
        axios.get('http://localhost:5000/api/allusers', {
        }).then( (res) => {
                const userCreate = res.data.filter( i => i.id === this.state.userId)[0];
                this.setState({
                    name: userCreate.firstName + ' ' + userCreate.lastName
                })
            }

        )
    };

    deleteCourse = e => {
        // deletes course
        e.preventDefault();
        const {emailAddress, password} = localStorage;
        const {_id} = localStorage;
        const {history} = this.props


            axios.delete(`http://localhost:5000/api/courses/${this.state.id}`,
                {
                    auth:{
                        username: emailAddress,
                        password
                    }
                },
                {
                    user: _id
                }).then(() => {
                history.push('/');
            }).catch(err => {
                if (err.response.status === 500) {
                    history.push('/error');
                } else {
                    console.log('Error deleting data', err);
                }
            })
        };

    render() {
        return (
            // this displays the buttons + course desc and so on.
            <div>
            <AuthConsumer>
                {({ isAuth, ownsCourse }) => (
                    <div className="actions--bar">
                        <div className="bounds">
                            <div className="grid-100">
                                {isAuth && ownsCourse ? (
                                    <span>
                    <NavLink to={`${this.state.id}/update`} className="button">
                      Update Course
                    </NavLink>
                    <button className="button" onClick={this.deleteCourse}>
                      Delete Course
                    </button>
                  </span>
                                ) : null}
                                <NavLink className="button button-secondary" to="/">
                                    Return to List
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
            </AuthConsumer>
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{this.state.title}</h3>
                        <p>By {this.state.name}</p>
                    </div>
                    <ReactMarkDown className="course--description">
                        {this.state.description}
                    </ReactMarkDown>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <h3>{this.state.estimatedTime}</h3>
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <ReactMarkDown>
                                    {this.state.materialsNeeded}
                                </ReactMarkDown>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default CourseDetail