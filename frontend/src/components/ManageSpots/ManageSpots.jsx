import { useEffect, useState } from "react";
import { BsStarFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getSpotsByCurrentUser } from "../../store/spots";
import { NavLink } from "react-router-dom";


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
                <div className="OuterDiv-manageSpots">
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
                                        {spot.avgRating !== 'No Ratings' && <p className='spotReview'><BsStarFill className='star'/> {spot.avgRating}</p>}
                                        {spot.avgRating === 'No Ratings' && <p><BsStarFill className='star'/>New</p>}
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
                            </div>
                        </div>
                    ))}
                </div>
            }
        </>
    );
}

export default ManageSpots;