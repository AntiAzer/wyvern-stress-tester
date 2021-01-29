import React from 'react';
import {
    Route,
    Redirect,
} from 'react-router-dom';
import axios from "axios";

const ProtectedRoute = ({ authed, changeAuthed, component: Component, ...rest }) => {
    const setComponent = (props) => {
        axios
        .post('/api/user/check',  JSON.stringify({
            token: localStorage.getItem('token')
        }), {
            headers: {
                "Content-Type": `application/json`,
            },
        })
        .then((res) => {
            if (res.data.code === 200) {
                changeAuthed(true);
            } else {
                changeAuthed(false);
            }
        })
        .catch(() => {
            changeAuthed(false);
        })
        if (authed) {
            return <Component {...props} />
        } else {
            return <Redirect
                to={{
                    pathname: '/login',
                    state: { from: props.location },
                }} />
        }
    }

    return (
        <Route
            {...rest}
            render={setComponent}
        />
    );
}

export { ProtectedRoute };
