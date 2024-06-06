import './DeleteSpotModal.css'
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteASpot } from "../../store/spots";
import { getSpotsByCurrentUser } from '../../store/spots';



const DeleteSpotModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        console.log("running handleDelete!")
        e.preventDefault();

  
        // dispatching to delete
        console.log("dispatching to delete");
        dispatch(deleteASpot(spotId))
   

        
        dispatch(getSpotsByCurrentUser())   
        closeModal()
        window.location.reload();
    }

    return (
        <div className='delete-modal-container'>
            <form onSubmit={handleDelete} >
                <h1>Confirm Delete</h1>
                <div>
                    <p>Are you sure you want to remove this spot from the listings?</p>
                </div>
                <button type="submit" className='delete-spot-button'>Yes - Delete Spot</button>
                <button onClick={() => closeModal()} className='cancel-button'>No - Keep Spot</button>
            </form>
        </div>
    )
}



export default DeleteSpotModal;