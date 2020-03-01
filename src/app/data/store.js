import { applyMiddleware, createStore, compose, combineReducers } from "redux";
//import rootReducer from "./ducks";
import reduxThunk from "redux-thunk";
//import { apiService } from "./middlewares";
import reducerRegistry from './reducerRegistry';
import { apiService, createLogger } from "./middlewares";
import logger from 'redux-logger';


const combine = (reducers, initialState) => {
    const reducerNames = Object.keys(reducers);
    if (typeof initialState !== 'undefined') {
      Object.keys(initialState).forEach(item => {
        if (reducerNames.indexOf(item) === -1) {
          reducers[item] = (state = null) => state;
        }
      });
    }
    return combineReducers(reducers);
  };

export function configureStore(preloadedState){
    let composeEnhancers = compose;
    if (typeof window !== 'undefined') {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        preloadedState = window.INITIAL_STATE || {};
        delete window.INITIAL_STATE;
    }

    const rootReducer = combine(reducerRegistry.getReducers(), preloadedState);
    //const rootReducer = combineReducers( reducers );
    const store = createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(
            applyMiddleware(
                apiService,
                reduxThunk,
                createLogger(true)
            ),
        ),
    );
    reducerRegistry.setChangeListener(reducers => {
        store.replaceReducer(combine(reducers, initialState));
    });
    return store;    
}