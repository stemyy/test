import React from 'react';
import {CssBaseline} from "@material-ui/core";
import Menu from '../components/Menu';
import Toaster from '../components/Toaster';

export default (props) => {
    const {children, darkMode, toggleDarkMode} = props;

    return (
        <React.Fragment>
            <Toaster/>
            <CssBaseline />
            <Menu darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            {children}
        </React.Fragment>
    )
};
