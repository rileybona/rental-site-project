import { csrfFetch } from "./csrf";

// CASES
export const GET_REVIEWS = 'reviews/GET_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// ACTION CREATERS
export const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews
});

export const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
});




// THUNKS 

 // GET All Reviews Thunk 
 export const getAllReviewsThunk = (spotId) => async (dispatch) => {
    console.log("entering G.A.Reviews thunk- - - ");
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

        if (response.ok) {
            console.log("review fetch = res.ok!")
            const reviews = await response.json();
            console.log("get reviews response object: ", reviews);
            dispatch(getReviews(reviews));
            return reviews;
        } else {
            throw new Error('GET reviews fetch failed !')
        }
    } catch(err) {
        console.log("~G.A.Reviews thunk ~fetch catching the following error: ", err);
        return err;
    }
 }

 // POST New Review Thunk
 export const createReviewThunk = (review, spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(review)
        });

        if (res.ok) {
            console.log("post review fetch = res.ok");
            const data = await res.json();
            dispatch(createReview(data));
            return data;
        }

    } catch(err) {
        console.log("C.R.Thunk post fetch caught the following error: ", err);
        return err; 
    }
 }


 // DELETE Review Thunk 
 export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    console.log("entering delete thunk review");
    try {
        const res = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            console.log("rev delete fetch = res.ok");
            dispatch(deleteReview(reviewId));
        } else {
            throw new Error("delete fetch failed");
        }

    } catch (err) {
        console.log("catching following error in rev. delete fetch: ", err);
        return err;
    }
 }



// REDUCER 
function reviewsReducer(state = {}, action) {
    switch (action.type) {
        case GET_REVIEWS: {
            const newStateObj = {};
            action.reviews.Reviews.forEach((review) => newStateObj[review.id] = review);
            return newStateObj;
        }
        case CREATE_REVIEW: {
            const newState = {...state, [action.review.id]: action.review};
            return newState;
        }
        case DELETE_REVIEW: {
            const newState = {...state};
            delete newState[action.reviewId];
            return newState;
        }
        default: return state;
    }
}

export default reviewsReducer;