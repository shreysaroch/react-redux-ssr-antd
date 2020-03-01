import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import {configureStore} from "../app/data/store";
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from '../routes/routes';
import '../scss/styles.less';

window.onload = () => {
  	Loadable.preloadReady().then(() => {
		let store = configureStore(window.INITIAL_STATE);
		ReactDOM.hydrate(
			<Provider store={ store }>
				<BrowserRouter>
					<div>{renderRoutes(Routes)}</div>
				</BrowserRouter>
			</Provider>
		, document.getElementById('app'));
  	});
};