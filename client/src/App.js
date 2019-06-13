import React from 'react';
import './App.css';
import Courses from "./components/Courses";
import { Route, Switch, Redirect } from 'react-router-dom';
import CourseDetail from './components/CourseDetail'
import {AuthProvider} from "./components/Authenticator";
import Header from "./components/Header";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";
import UpdateCourse from "./components/UpdateCourse";
import CreateCourse from "./components/CreateCourse";
import PrivateRoute from "./components/PrivateRoute"
import Forbidden from "./components/Forbidden";
import UnhandledError from "./components/UnhandledError"
import NotFound from './components/NotFound'

function App() {
  return (
    <div>

      <AuthProvider>
        <Header/>
      <Switch>

        <Route exact path="/" component={Courses} />
        <PrivateRoute exact path="/courses/create" component={CreateCourse}/>
      <Route exact path="/courses/:id" component={CourseDetail} />
        <Route exact path="/signin" component={UserSignIn} />
        <Route exact path="/signup" component={UserSignUp} />
        <PrivateRoute exact path="/courses/:id/update" component={UpdateCourse} />
        <Route exact path="/signout" component={UserSignOut}/>
          <Route exact path="/forbidden" component={Forbidden} />
          <Route exact path="/notfound" component={NotFound} />
          <Route exact path="/error" component={UnhandledError} />
          <Route render={() => <Redirect to="/notfound" />} />
      </Switch>
      </AuthProvider>
    </div>
  );
}

export default App;
