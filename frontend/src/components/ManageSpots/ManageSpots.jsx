import { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsByCurrentUser } from "../../store/spots";
import { NavLink } from "react-router-dom";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import OpenModalButton from "../OpenModalButton";
import './ManageSpots.css';


function createRating (avgRating) {
    let string = '';

    if (avgRating === "This spot has no reviews yet.") {
        string = 'New';
    } else {
        let intRating = parseInt(avgRating);
        let fixedRating = intRating.toFixed(1);
        string = `${fixedRating}`;
    }
    
    return string;
}

function ManageSpots () {
    const dispatch = useDispatch(); 
    // declare states and hooks 
    const [done, setDone] = useState(false);
    // const currentUser = useSelector((state) => state.session.user);
    const spotState = useSelector((state) => Object.values(state.spots));

    // create a useEffect to pull spots by c.u. 
    useEffect(() => {
        // dispatch to G.S.B.Y. thunk
        dispatch(getSpotsByCurrentUser());
    }, [dispatch]);    

    // second useEffect to set 'done' 
    useEffect(() => {
        setTimeout(() => {
            if (spotState.length > 0 || spotState.length === 0) setDone(true);
        }, 20)
    }, [spotState]);

    return (
        <>
            { !done ? 
                <h1 className="loading-screen">loading</h1>
                :
                <div className="manage-page">
                    <h1 className="manage-title">Manage Spots</h1>
                    {(spotState?.length > 0) ?
                        <div className='outerDiv-manageSpots'>
                            {spotState.map((spot) => (
                                <div className='spot-card-home' key={spot.id}>
                                    <NavLink to={`/spots/${spot.id}`} className='nav-link-spot-card'>
                                        <div className='spotImg-container'>
                                            <img className='spotImg' src={spot.previewImage} alt='house' />
                                            <span className='title-tooltip'>{spot.name}</span>
                                        </div>
                                        <div className='spot-info-div'>
                                            <div className='spot-info-upper'>
                                                <p>{`${spot.city}, ${spot.state}`}</p>
                                                <p className='spotReview'><BsStarFill className='star'/> {createRating(spot.avgRating)}</p>
                                            </div>
                                            <div className='spot-info-price'>
                                                <p className='spot-price'>{`$${spot.price}`}</p>
                                                <p className='spot-price2'>/night</p>
                                            </div>
                                        </div>
                                    </NavLink>
                                    <div className="update-delete-container">
                                        <NavLink to={`/spots/${spot.id}/edit`}>
                                            <button>Update</button>
                                        </NavLink>

                                        <OpenModalButton buttonText={'Delete'} modalComponent={<DeleteSpotModal spotId={+spot.id} />}/>
                                    </div>
                                </div> 
                            ))} 
                        </div> :
                        <div className="noSpots-button-container">
                            <NavLink id='create-spot-no-spots' to='/spots/new'>Create a New Spot</NavLink>
                        </div>
                    }                   
                </div> 
            }
        </>
    );
}

export default ManageSpots;