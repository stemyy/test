import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import { Provider } from 'react-redux';
import Root from './containers/Root';
import {configureStore, history} from './store/configureStore';
import './app.global.css';

const store = configureStore();

render(
    <AppContainer>
        <Provider store={store}>
            <Root store={store} history={history}/>
        </Provider>
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        // eslint-disable-next-line global-require
        const NextRoot = require('./containers/Root').default;
        render(
            <AppContainer>
                <Provider store={store}>
                    <NextRoot store={store} history={history}/>
                </Provider>
            </AppContainer>,
            document.getElementById('root')
        );
    });
}
