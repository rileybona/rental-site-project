import { csrfFetch } from "./csrf";

// define LABELS
export const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
export const GET_SPOT = 'spots/GET_SPOT';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const GET_SPOT_BY_USER = 'spots/GET_SPOT_BY_USER'
export const UPDATE_SPOT = 'spots/UPDATE_SPOT'
export const DELETE_SPOT = 'spots/DELETE_SPOT';

// ACTION CREATORS
export const GetAllSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
});

export const GetSpot = (spot) => ({
    type: GET_SPOT,
    spot
});

export const createASpot = (spots) => ({
    type: CREATE_SPOT,
    spots
});

export const getCurrentUserSpots = (spots) => ({
    type: GET_SPOT_BY_USER,
    spots
});

export const updateSpot = (spots) => ({
    type: UPDATE_SPOT,
    spots
});

export const deleteSpot = (spots) => ({
    type: DELETE_SPOT,
    spots
});



// THUNKS
// get all spots
export const getAllSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots');
        // log response
        console.log("🚀 ~ getAllSpots ~ response:", response)
        if (response.ok) {
            const { spots } = await response.json();
            // log spots
            console.log("🚀 ~ getAllSpots ~ spots:", spots)
            dispatch(loadSpots(spots));
            return response;
        } else {
            throw new Error("failed to get spots")
        }
    } catch (err) {
        console.log(err);
        return err;
    }
   
}



// REDUCER

const spotsReducer = (state = {}, action) => {
    console.log("action in spotsReducer: ", action);
    switch(action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        default: return state;
    }
}

export default spotsReducer;

