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



// THUNKS
// get all spots
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

// get spot by id 
export const getSpotDetails = (spotId) => async (dispatch) => {
    try {
        console.log("---- ~getSpotDetails thunk executing ---")
        const response = await csrfFetch(`/api/spots/${spotId}`);

        if (response.ok) {
            const data = await response.json();
            console.log("~getSpotDetails data obj: ", data);
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

// create a spot 
export const createASpot = (spot, mainImage, images) => async (dispatch) => {
    console.log(" ~createASpot thunk is executing...");
    // console.log("-- folloing spot object read to the function: ", spot)
    // translate to array of urls
    // console.log("~create thunk taking in images as: ", images);
    const imgLinks = [];
    if (images) {
        const imgArray = Object.values(images);
        imgArray.forEach((url) => {
            if (url.length) imgLinks.push(url);
        })
        // console.log("🚀 ~ createASpot ~ imgLinks:", imgLinks)
    }
        
    

    spot.price = parseFloat(spot.price);
    // const formatted = JSON.stringify(spot);
    // console.log("spot in JSON.stringify formatting: ", formatted);


    try {
        const res = await csrfFetch('/api/spots', {
            method: 'POST',
            body: JSON.stringify(spot)
        });

  
        if (res.ok) {
            const newSpot = await res.json();
            console.log("🚀 ~ createASpot Fetch ~ res.ok");


            // upload main image 
            console.log("Executing mainImage POST fetch");
            const mainResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ url: mainImage, preview: true})
            });

            // console.log("🚀 ~ createASpot ~ mainResponse:", mainResponse);
            const mainData = await mainResponse.json();
            console.log("🚀 ~ createASpot ~ main image POST fetch res Data:", mainData);


            // upload secondary images (if there are any)
            if (images && imgLinks.length) {
                console.log("~ createASpot ~ executing image array POST fetch");
                imgLinks.forEach(async (url) => {
                    await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: url, preview: false})
                     });
                });
            }
            
            dispatch(createSpot(newSpot));
            console.log("return the following object back to handleSubmit: ", newSpot);
            return (newSpot);
        } else {
            throw new Error("failed to create spot!")
        }
    } catch (err) {
        console.log("catching an err in createSpot: ", err);
        return err;
    }

   

}

// get all spots by current user thunk [TO-DO try-catch!]
export const getSpotsByCurrentUser = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');
    const data = await res.json();

    await dispatch(getCurrentUserSpots(data));
}

// update a spot thunk [TO DO ! add IMAGES !!!]
export const updateASpot = (spot, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    });

    const data = await res.json();

    dispatch(createSpot(data));
}

// delete a spot thunk
export const deleteASpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });

    // mm double check this, luv 
    dispatch(deleteSpot(spotId))
    return res.json('Spot deleted!');
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
            action.spots.Spots.forEach((spot) => {
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

