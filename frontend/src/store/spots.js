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

// CREATE A SPOT THUNK 
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

// GET ALL SPOTS BY USER ID [Thunk]
export const getSpotsByCurrentUser = () => async (dispatch) => {
    console.log("~ entering get spots by current user - - ");

    try {
        // send fetch to server for spots by current user
        const res = await csrfFetch('/api/spots/current');

        if (res.ok) {
            // if response okay, json the response object
            // console.log("/spots/current fetch = res.ok");
            const data = await res.json();

            // console.log("G.S.B.C.U fetch response data object: ", data);
            // then dispatch object to action creator 
            dispatch(getCurrentUserSpots(data));
            return data;

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
    console.log("hitting update thunk --");

    // create array of image urls if there are secondary images
    const imgLinks = [];
    if (images) {
        const imgArray = Object.values(images);
        imgArray.forEach((url) => {
            if (url.length) imgLinks.push(url);
        })
        // console.log("🚀 ~ update thunk ~ imgLinks:", imgLinks)
    }

    spot.price = parseFloat(spot.price);

    try {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spot)
        });

        if (res.ok) {
            console.log("update fetch = res.ok!");

            const data = await res.json();
            // console.log("data in update thunk is : ", data);

            // upload main image 
            // console.log("update thnk ~ Executing mainImage POST fetch");
            // console.log("passing in main image as : ", mainImage);

            if (mainImage) {
                const mainResponse = await csrfFetch(`/api/spots/${data.id}/images`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ url: mainImage, preview: true})
                });
            }
           

            // upload secondary images (if there are any)
            if (images && imgLinks.length) {
                // console.log("~ update spot ~ executing image array POST fetch");
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
    console.log("entering delete thunk");

    try {
        const res = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            console.log("delete fetch = res.ok");
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
            // console.log("reducer case - action: ", action);
            // console.log("reducer case - action.spots: ", action.spots);
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

