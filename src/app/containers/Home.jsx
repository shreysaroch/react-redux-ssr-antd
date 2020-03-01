import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";
import "../data/ducks/countries/reducers";
import { fetchCountries } from "../data/ducks/countries/actions";
import CountriesItem from '../components/CountriesItem';

const Home = (props) => {
	const { countries } = props;
	useEffect(()=>{
		if(countries.length == 0){
			props.fetchCountries();
		}		
	},[]);
	
	return (
		<>
		<Helmet>
			<title>Inside Home</title>
			<meta property="description" content={"Home Page"} />
		</Helmet>		
		<div className="container">	
			<div className="countries-container">
				{countries && countries.map((item, i) => <CountriesItem key={i} {...item} />)}
			</div>
		</div>
		</>
	);	
}

Home.fetching = ({ dispatch }) => {
	return [dispatch(fetchCountries())];
}

Home.defaultProps = {
	countries: []
};

const mapStateToProps = (state) => ({
	countries: state.countries.countries
});

const mapDispatchToProps = {
	fetchCountries
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);