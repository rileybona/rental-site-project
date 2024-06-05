import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './Homepage.css';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";

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
                                {spot.avgRating !== 'No Ratings' && <p className='spotReview'><BsStarFill className='star'/> {spot.avgRating}</p>}
                                {spot.avgRating === 'No Ratings' && <p><BsStarFill className='star'/>New</p>}
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
    )
}

export default Homepage;

