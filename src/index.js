import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import './index.css';
import Game from './Game/Game';
import * as serviceWorker from './serviceWorker';
import * as reducers from './_store/reducers';
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
		<Game />
	</Provider>,
    document.getElementById('root'));
serviceWorker.unregister();