import { useDispatch, useSelector } from 'react-redux';
import './CreateReviewModal.css';
import { useModal } from '../../context/Modal';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createReviewThunk } from '../../store/reviews';
import { getSpotDetails } from '../../store/spots';
import StarModalComponent from './StarModalComponent';
// import { getSpotDetails } from '../../store/spots';

function CreateReviewModal (spot) {
    console.log("entering create review modal");
    // declare hooks
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const [errorClass, setErrorClass] = useState('hidden');


    // read store / slices of state
    const allReviews = useSelector(state => Object.values(state.reviews));
    const currentUser = useSelector(state => state.session.user);

    console.log("current user = ", currentUser);
    console.log("spot prop = ", spot);
    const owner = spot.spot.Owner;

    // const owner = useSelector(state => state.spots[spotId].Owner.id);
    console.log("spot owner = ", owner);

    const reviewed = allReviews?.some(review => review.userId === currentUser.id);
    console.log("reviewed = ", reviewed);

    // declare states
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');
    const [errors, setErrors] = useState({});

    // update errors w. useEffect
    useEffect(() => {
        const errorsObj = {};
        if (review.length < 10) errorsObj.review = "Review must be at least 10 characters";
        if (!stars) errorsObj.stars = "Please rate your stay 1 - 5";
        setErrors(errorsObj);
    }, [review, stars]);

    // on submit - dispatch baby 
    const submitHandler = async (e) => {
        e.preventDefault();

        if (Object.values(errors).length) {
            setErrorClass('error-msg');
            return;
        }

        const newReview = {
            review,
            stars
        }

        dispatch(createReviewThunk(newReview, spotId));
        dispatch(getSpotDetails(spotId));
        closeModal();
        window.location.reload();
        // reset states ?
        setReview('');
        setStars(null);
        setErrors({});
    }

    // prevent restricted actions 
    if (!(currentUser && (currentUser !== owner) && !reviewed)) closeModal();

    // RETURN / HTML 
    return (
        <div className='review-modal-container'>
            {currentUser && (currentUser !== owner) && !reviewed && (
                <form onSubmit={submitHandler}>
                    <h1>How was your stay?</h1>
                    {errors.review && <p className={errorClass}>{errors.review}</p>}
                    <textarea 
                        type='text'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...'
                    />

                    {errors.stars && <p className={errorClass}>{errors.stars}</p>}
                    <StarModalComponent stars={stars} setStars={setStars}/>

                    <button
                        type='submit'
                        className='submit-review-button'
                        disabled={Object.values(errors).length > 0}>Submit Your Review</button>
                </form>
            )}
        </div>
    );
}

export default CreateReviewModal;