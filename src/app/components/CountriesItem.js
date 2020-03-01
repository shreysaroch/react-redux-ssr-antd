import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from "antd";

export default ({ name, flag, capital, population })  => {
  return (
    	<Link to={`/country/${name}`} className="countries-item">
      		<div className="countries-item-data">
        		<h4>{name}</h4>
        		<span>{capital}</span>
        		<span>{population}</span>
				<Button type={'primary'}>ant d btn</Button>

			</div>
    	</Link>
  	)
}