import React, {useState} from 'react';
import { Route, Switch } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import StockPage from './containers/StockPage';
import ProviderPage from './containers/ProviderPage';
import MakerPage from './containers/MakerPage';
import OrderPage from './containers/OrderPage';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";

export default () => {
    const [darkMode, setDarkMode] = useState((localStorage.getItem('darkMode') === 'true'));

    const toggleDarkMode = () => {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    };

    const theme = createMuiTheme({
        palette: {
            type: darkMode ? 'dark' : 'light',
            primary: {main: red[700]},
            secondary: { main: red[200] },
        },
        typography: { useNextVariants: true },
    });

    return (
        <MuiThemeProvider theme={theme}>
            <App darkMode={darkMode} toggleDarkMode={() => toggleDarkMode()}>
                <Switch>
                    <Route path={routes.PROVIDER} component={ProviderPage}/>
                    <Route path={routes.MAKER} component={MakerPage}/>
                    <Route path={routes.ORDERS} component={OrderPage}/>
                    <Route exact path={routes.STOCK} component={StockPage}/>
                </Switch>
            </App>
        </MuiThemeProvider>
    )
};
