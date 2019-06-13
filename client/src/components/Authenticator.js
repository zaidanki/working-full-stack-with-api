import React, { Component } from 'react';
import axios from 'axios';

const Authenticator = React.createContext();

class AuthProvider extends Component {
    state = {
        isAuth: false,
        _id: null,
        name: null,
        firstName: null,
        lastName: null,
        emailAddress: null,
        password: null,
        confirmPassword: null,
        errors: null,
        ownsCourse: false
    };

    componentDidMount() {
        this.updateUser();
    }


    updateStorage = () => {
        // this is turning the state into arrays and then setting the local storage
        return Object.keys(this.state).map(key => {
            return localStorage.setItem(key, this.state[key]);
        });
    };

    updateUser = () => {
        // this is getting the local storage to update the state
        return Object.keys(this.state).map( key => {
            return this.setState({
                [key]: localStorage.getItem(key)
            })
        })
    };

    // this is to sign in
    signIn = e => {
        if (e) e.preventDefault();
        const { emailAddress, password } = this.state;
// this is getting the users from  here
        axios.get('http://localhost:5000/api/users', {
            auth: {
                username : emailAddress,
                password : password
            }
        }).then( res => {
            this.setState({
                isAuth: true,
                _id: res.data.id,
                emailAddress : emailAddress,
                password: password,
                name: res.data.firstName + ' ' + res.data.lastName
            });
            this.updateStorage();
        }).catch( e => {
            console.log('Error in signing in: ' + e);
        });
    };

    signUp = e => {
        // this is to signup
        e.preventDefault();
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        } = this.state;
        if(password !== confirmPassword){
            let msg = ['Passwords do not match'];
            this.setState({
                errors: msg
            })
        } else
        axios
            .post(`http://localhost:5000/api/users`, {
                firstName,
                lastName,
                emailAddress,
                password,
                confirmPassword
            })
            .then(() => {
                this.signIn();
            })
            .catch(err => {
                if (err.response.status === 400) {
                    const errors = err.response.data;
                    const messages = Object.values(errors).map(err => {
                        return err.message;
                    });
                    this.setState({
                        errors: messages
                    });
                } else {
                    console.log('Error signing up', err);
                }
            });
    };

    signOut = () => {
        this.setState({
            isAuth: false,
            name: null,
            emailAddress: null,
            password: null
        });
        localStorage.clear()
    };

    isCourseOwner = courseId => e => {
        if(this.state._id === courseId){
            this.setState({
                ownsCourse: true
            });
        } else {
            this.setState({
                ownsCourse: false
            })
        }
    };

    // Updates as user types in inputs.
    handleChange = e => {

        if(e.currentTarget.value === ''){
         this.setState({
             [e.currentTarget.name]: null
         })
        } else
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        });
        localStorage.setItem([e.currentTarget.name], e.currentTarget.value);
    };

    render() {
        const { _id, isAuth, name, errors, ownsCourse } = this.state;

        return (
            <Authenticator.Provider
                value={{
                    id: _id,
                    state: this.state,
                    isAuth,
                    signIn: this.signIn,
                    signUp: this.signUp,
                    signOut: this.signOut,
                    name,
                    handleChange: this.handleChange,
                    errors,
                    isCourseOwner: this.isCourseOwner,
                    ownsCourse
                }}
            >
                {this.props.children}
            </Authenticator.Provider>
        );
    }
}

const AuthConsumer = Authenticator.Consumer;

export  { AuthProvider , AuthConsumer};
