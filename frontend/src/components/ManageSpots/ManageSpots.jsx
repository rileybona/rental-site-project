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
    const [badcode, setBadcode] = useState(1);


    // create a useEffect to gen spots by c.u. 
    useEffect(() => {
        console.log("~manageSpots useEffect executing...");
        // dispatch to G.S.B.Y. thunk then set Donee
        dispatch(getSpotsByCurrentUser()).then((data) => {
            console.log("data return from thunk: ", data);
            if (spotState.length > 0) {
                console.log("hitting if statement in use effect");
                console.log("spotArray: ", spotState);
                setDone(true);
            } else {
                setBadcode(badcode + 1);
            }
        });
    }, [dispatch, badcode]);


    return (
        <>
            { !done ? 
                <h1>loading !!!!</h1>
                :
                <div className="page">
                    <h1 className="manage-title">Manage Spots</h1>
                    <div className="outerDiv-manageSpots">
                        {(spotState.length > 0) ? spotState.map((spot) => (
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
                        )) : 
                        <NavLink to='/spots/new' className={'createSpot-button-manage'}>Create a New Spot</NavLink>
                        }
                    </div>
                </div>
                
            }
        </>
    );
}

export default ManageSpots;