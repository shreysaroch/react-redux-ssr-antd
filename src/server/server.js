import React from 'react';
import express from 'express';
import path from 'path';
import bodyParser from "body-parser";
import compression from "compression";
import Loadable from 'react-loadable';
import { configureStore } from "../app/data/store";
import Routes from '../routes/routes';
import render from './renderer/render';
import { matchRoutes } from 'react-router-config';
const api = require('./routes/api');

const server = express();
const PUBLIC_DIR = path.resolve(__dirname, "../../public");
//server.use(express.static(PUBLIC_DIR, { maxAge: 90*24*60*60*1000 })); // 90*24*60*60*1000 == 90*(24*60*60*1000[1 Day]) // [90 Days]
server.use(express.static(PUBLIC_DIR));
server.use(compression());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use((req, res, next) => {
	if (/\.js|\.css/.test(req.path)) {
		res.redirect('/dist' + req.path);
	} else {
		next();
	}
});
  

server.use('/api', api);


server.get('/healthcheck', (req, res) => {
	res.send('ok')
});

  
server.get('*', async (req, res) => {
	let routeMatch = {};
	let store = configureStore({});
	const actionsTemp = matchRoutes(Routes, req.path).map(({route, match}) => {
		routeMatch = match;
		return !route.component.preload ? route.component : route.component.preload().then(res => {
			return res.default
		})
	});

	const loadedActions = await Promise.all(actionsTemp);
	const actions = loadedActions
		.map((component) => {
			return component.fetching ? component.fetching({ ...store, match:routeMatch, location: req.originalUrl, path: req.path }) : null
		})
		.map(async actions => {
			return await Promise.all((actions || []).map(p => p && new Promise((resolve) => p.then(resolve).catch(resolve))))
		});

	await Promise.all(actions);

	const context = { };
	render(req.path, res, store, context);
});

Loadable.preloadAll().then(() => {
	server.listen(3003, () => {
		console.log('Running on http://localhost:3003/');
	});
}).catch(err => {
	console.log(err);
});