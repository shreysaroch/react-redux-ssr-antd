import fetch from "../utils/fetch";

const baseUrl = 'https://restcountries.eu/rest/v2';
const apiService = ( { } ) => ( next ) => ( action ) => {
    var allCalls = [];
    if(typeof action.CALL_API === 'undefined') {
        return next(action);
    }
    action.CALL_API.map((action)=> {
        if(action !== null) {
            const { path, method = "GET", body } = action.meta;
            let url = `${ baseUrl }${ path }`;
            if(path.indexOf('http') !== -1){
                url = path;
            }

            //console.log(url);
            allCalls.push( fetch( url, method, body ).then(
                res => handleResponse( res, action, next ),
                err => handleErrors( err, action, next ))
            );
        }
    });

    return new Promise( (resolve, reject) =>{
        Promise.all(allCalls).then( (results) =>{
            action.CALL_API.map((action,idx)=> {
                var cb = typeof action.meta.success !== "undefined"  ?  action.meta.success : false;
                if(cb){
                    var rs = cb(results[idx]);
                    var allChildCalls = [];
                    rs.map((childAction)=> {
                        const { path, method = "GET", body } = childAction.meta;
                        const url = `${ baseUrl }${ path }`;
                        console.log(url);
                        allChildCalls.push( fetch( url, method, body ).then(
                                        res => handleResponse( res, childAction, next ),
                                        err => handleErrors( err, childAction, next ))
                        );
                    });
                    return Promise.all(allChildCalls).then( (allChildResults)=>{
                        resolve(allChildCalls);
                    }).catch( ex => {
                        reject(ex);
                    });
                }else{
                    resolve(allCalls);
                }
            });
        }).catch( ex => {
            reject(ex);
        });
    });
};

export default apiService;

function handleErrors( err, action, next ) {
    next( {
        type: `${ action.type }`,
        payload: err,
        meta: action.meta,
    } );
    return Promise.reject( err );
}

function handleResponse( res, action, next ) {
    try{
        if(res.error && res.error < 500 && res.error >= 400){
            res = { code: res.error, message: 'Not Found', data: [], critical: action.meta.critical ? action.meta.critical : 0 };
        }else if(res.error && res.error >= 500){
            res = { code: res.error, message: 'Internal server error', data: [], critical: action.meta.critical ? action.meta.critical : 0 };
        }else{
            res.critical = action.meta.critical ? action.meta.critical : 0
        }

        next( {
            type: `${ action.type }`,
            payload: res,
            meta: action.meta,
        } );
        return res;
    }catch(ex){
        return ex;
    }
}
