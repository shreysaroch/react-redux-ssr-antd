import types from "./types";

export function fetchCountries() {
    return {
        CALL_API: [
            {
                type: types.RECEIVE_COUNTRIES,
                meta: {
                    path: "/all",
                    method: "GET",
                }
            }
        ]
    }
}


export function fetchCountry(name) {
    return {
        CALL_API: [
            {
                type: types.RECEIVE_COUNTRY,
                meta: {
                    path: "/name/"+name,
                    method: "GET",
                }
            }
        ]
    }
}