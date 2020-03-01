import React from 'react';
import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Helmet from "react-helmet";
import ErrorBoundary from '../components/ErrorBoundary';
const App  = (props) => {
	return (
		<>
			<Helmet
				defaultTitle="React Boilerplate"
				titleTemplate="%s"
				titleAttributes={{itemprop: "name", lang: "en"}}
				meta={[
					{property: "og:site_name", content: "React Boilerplate"},
					{name: "twitter:card", content: "summary_large_image"},
					{property: "og:title", content: "%s"},
					{property: "og:type",  content: "website"},
					{name: "viewport",  content: "width=device-width, initial-scale=1.0"},
					{name: "theme-color",  content: "#ff0037"},
				]}
			/>
			<div align="center">
				<img src="/images/logo.png" width="50" />
			</div>
			<ErrorBoundary>
				{renderRoutes(props.route.routes)}
			</ErrorBoundary>
		</>
	)
}

export default App;


