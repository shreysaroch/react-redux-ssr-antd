import React, {useEffect} from 'react';
import Helmet from "react-helmet";
import {fetchCountries} from "../data/ducks/countries/actions";
import "../data/ducks/countries/reducers";
import {connect} from "react-redux";
import CountriesItem from '../components/CountriesItem';
import {Button} from "antd";
import {Link} from "react-router-dom";


const City = (props) => {
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
                <Link to={'/'}>
                <Button type="danger">Go to Home</Button>
                </Link>
                <div className="countries-container">
                    {countries && countries.map((item, i) => <CountriesItem key={i} {...item} />)}
                </div>
            </div>
        </>
    );
};
City.fetching = ({ dispatch }) => {
    return [dispatch(fetchCountries())];
};

City.defaultProps = {
    countries: []
};

const mapStateToProps = (state) => ({
    countries: state.countries.countries
});

const mapDispatchToProps = {
    fetchCountries
};

export default connect(mapStateToProps, mapDispatchToProps)(City);