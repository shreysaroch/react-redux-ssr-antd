export default function (initialState) {
  	return function (reducerMap) {
  		return function (state = initialState, action) {
			const reducer = reducerMap[action.type];
			return reducer ? reducer(state, action) : state;
    	};
  	};
};