import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Homepage.css';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";

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

function Homepage() {
    // define state variables, react hooks
    const dispatch = useDispatch();
    // define use selector to listen to spots slice of state  
    const spotState = useSelector(state => Object.values(state.spots));

    // create useEffect function that executes on page render 
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        // check on '.toFixed()' error
        // create large div containing all cards 
        <div className='page'>
            <div className='the-great-outer-div-home'>
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
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Homepage;

