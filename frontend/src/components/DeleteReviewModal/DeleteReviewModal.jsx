import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReviewThunk } from '../../store/reviews';
import OpenModalButton from '../OpenModalButton';
import './DeleteReviewModal.css';
// import { useEffect } from 'react';
import { getSpotDetails } from '../../store/spots';


function DeleteReviewModal ({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // use effect 2 dsptch?

    // handlesubmit 
    const deleteUserReview = async (e) => {
        e.preventDefault();

        dispatch(deleteReviewThunk(reviewId));
        closeModal();
        dispatch(getSpotDetails(spotId));
        window.location.reload();
    }

    // rtn / html
    return (
        <OpenModalButton 
            buttonText={'Delete'}
            modalComponent={
                <div className='delete-modal-container'>
                    <h1>Confirm Delete</h1>
                    <p>Are you sure you want to delete this review?</p>
                    <button className='yes-button' onClick={deleteUserReview}>Yes (Delete Review)</button>
                    <button className='no-button' onClick={() => closeModal()}> No (Keep Review)</button>
                </div>
            }
        />
    )


}

export default DeleteReviewModal;