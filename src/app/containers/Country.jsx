import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";
import { fetchCountry } from "../data/ducks/countries/actions";
import "../data/ducks/countries/reducers";
import {Link} from "react-router-dom";

const Country = (props) => {
	useEffect(()=>{
		props.fetchCountry(props.match.params.name);
	},[props.match.params.name]);

	const { country } = props.country;
	if(country.length == 0 || !country.name || country.name !=props.match.params.name){
		return <div>Loading ...</div>
	}
	return (
		<>
			<Helmet>
				<title>Inside Country{country.name}</title>
				<meta property="description" content={country.capital} />
			</Helmet>
			<div className="container">
				<p><Link to={'/'}>Home</Link></p>
				<div className="countries-container">
					<div className="countries-item-data">
						<h4>{country.name}</h4>
						<div>{country.capital}</div><br/>
						<div>{country.population} population.</div><br/>
						<div>{country.borders.join(', ')}</div><br/>
					</div>
				</div>
			</div>
		</>
	);
}

Country.fetching = ({ dispatch, match }) => {
	return [dispatch(fetchCountry(match.params.name))];
}

const mapStateToProps = (state) => ({
	country: state.countries
});

const mapDispatchToProps = {
	fetchCountry
};

export default connect(mapStateToProps, mapDispatchToProps)(Country);