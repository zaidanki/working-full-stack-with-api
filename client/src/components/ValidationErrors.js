import React, { Component } from 'react';

// Displays if user does not enter a title or description in create or updateCourse or on signup.
class ValidationErrors extends Component {
    render() {
        const { errors } = this.props;
        let valError = 'Whoops! Please fix this error:';

        if (errors) {
            if (errors.length > 1) {
                valError = 'Whoops! Please fix these errors:';
            }
            return (
                <div>
                    <h2 className="validation--errors--label">{valError}</h2>
                    <div className="validation-errors">
                        <ul>
                            {errors.map((msg, i) => {
                                return <li key={i}>- {msg}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default ValidationErrors;