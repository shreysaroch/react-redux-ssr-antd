import fetch from "isomorphic-fetch";
export default ( url, method, body ) => {
    let options = '';
    if(method === "GET"){
        options = {
            method    
        }
    }else{
        options = {
            method,
            headers: requestHeaders( ),
            body: JSON.stringify( body ),
        }
    }
    return fetch( url, options )
        .then( res => parseStatus( res.status, res) );
};

function parseStatus( status, res ) {
    return new Promise( ( resolve, reject ) => {
        if ( status >= 200 && status < 300 ) {
            res.json().then( response => resolve( response ) );
        } else {
            resolve({success:0, error:status, response:[]});
        }
    } );
}

function requestHeaders( ) {
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
}
