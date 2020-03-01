import reducerRegistry from '../../reducerRegistry';
import types from "./types";

function countries(
    state = {
        countries:[],
        country:{}
    },
    action
  ) {
    switch (action.type) {
      case types.RECEIVE_COUNTRIES:
        state.countries = action.payload;
        return {
          ...state
        };
      case types.RECEIVE_COUNTRY:
        state.country = action.payload[0];
        return {
          ...state
        };

      default:
        return state;
    }
}
reducerRegistry.register('countries',countries);
export default countries;
