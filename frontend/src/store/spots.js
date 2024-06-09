import { csrfFetch } from "./csrf";

// define LABELS
export const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
export const GET_SPOT = 'spots/GET_SPOT';
export const CREATE_SPOT = 'spots/CREATE_SPOT';
export const GET_SPOT_BY_USER = 'spots/GET_SPOT_BY_USER'
export const UPDATE_SPOT = 'spots/UPDATE_SPOT'
export const DELETE_SPOT = 'spots/DELETE_SPOT';

// ACTION CREATORS
export const loadSpots = (spots) => ({
    type: GET_ALL_SPOTS,
    spots
});

export const getSpot = (spot) => ({
    type: GET_SPOT,
    spot
});

export const createSpot = (spots) => ({
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



// THUNKS - - - - - - - - -- - -- - - -- - -- - - - - - - - -

// GET ALL SPOTS THUNK 
export const getAllSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots');
        if (response.ok) {
            const res = await response.json();
            const spots = res.Spots;

            dispatch(loadSpots(spots))
        } else {
            throw new Error("failed to get spots")
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

// GET SPOT BY ID THUNK 
export const getSpotDetails = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);

        if (response.ok) {
            const data = await response.json();
            dispatch(getSpot(data));
            return(data);
        } else {
            throw new Error("failed to get spot details");
        }
    } catch (err) {
        console.log("catching an error in getDeets: ", err);
        return err;
    }
}

// CREATE A SPOT THUNK 
export const createASpot = (spot, mainImage, images) => async (dispatch) => {
    // translate to array of urls
    const imgLinks = [];
    if (images) {
        const imgArray = Object.values(images);
        imgArray.forEach((url) => {
            if (url.length) imgLinks.push(url);
        })
    }
        
    
    // conver price input to float 
    spot.price = parseFloat(spot.price);

    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            body: JSON.stringify(spot)
        });

  
        if (res.ok) {
            const newSpot = await res.json();

            // upload main image 
            await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ url: mainImage, preview: true})
            });

            // upload secondary images (if there are any)
            if (images && imgLinks.length) {
                imgLinks.forEach(async (url) => {
                    await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: url, preview: false})
                     });
                });
            }
            
            dispatch(createSpot(newSpot));
            return (newSpot);
        } else {
            throw new Error("failed to create spot!")
        }
    } catch (err) {
        console.log("catching an err in createSpot: ", err);
        return err;
    }

   

}

// GET ALL SPOTS BY USER ID [Thunk]
export const getSpotsByCurrentUser = () => async (dispatch) => {

    try {
        // send fetch to server for spots by current user
        const res = await csrfFetch('/api/spots/current');

        if (res.ok) {
            // if response okay, json the response object
            const data = await res.json();

            if (data.message) {
                dispatch(getCurrentUserSpots([]));
            } else {
                // then dispatch object to action creator 
                dispatch(getCurrentUserSpots(data));
                return data;
            }

            

        } else {
            throw new Error("spots/current fetch failed");
        }
    } catch(err) {
        console.log("getSpotsByUser caught the following error: ", err);
        return err;
    }
}

// update a spot thunk 
export const updateASpot = (spot, spotId, mainImage, images) => async dispatch => {

    // create array of image urls if there are secondary images
    const imgLinks = [];
    if (images) {
        const imgArray = Object.values(images);
        imgArray.forEach((url) => {
            if (url.length) imgLinks.push(url);
        })
    }

    spot.price = parseFloat(spot.price);

    try {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spot)
        });

        if (res.ok) {
            const data = await res.json();

            // upload main image 
            if (mainImage) {
                // const mainResponse = 
                await csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ url: mainImage, preview: true})
                });
            }
           

            // upload secondary images (if there are any)
            if (images && imgLinks.length) {
                imgLinks.forEach(async (url) => {
                    await csrfFetch(`/api/spots/${data.id}/images`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: url, preview: false})
                     });
                });
            }

            dispatch(updateSpot(data));
            return data;

        } else {
            throw new Error("update fetch failed");
        }
    } catch(err) {
        console.log("catching error @ update spot fetch: ", err)
        return err;
    }
}

// delete a spot thunk
export const deleteASpot = (spotId) => async dispatch => {

    try {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            dispatch(deleteSpot(spotId))
            return await res.json('Spot deleted!');
        } else {
            throw new Error("fetch to delete failed!");
        }

    } catch(err) {
        console.log("catching err in delete: ", err);
        return err;
    }
    
}



// REDUCER

const spotsReducer = (state = {}, action) => {
    switch(action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case GET_SPOT: {
            const newState = {};
            newState.spot = action.spot;
            return newState;
        }
        case CREATE_SPOT: {
            const newState = { ...state };
            newState[action.spots.id] = action.spots;
            return newState;
        }
        case GET_SPOT_BY_USER: {
            const newState = {};
            action.spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = { ...state };
            newState[action.spots.id] = action.spots;
            return newState;
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default: return state;
    }
}

export default spotsReducer;

