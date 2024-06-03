import { useDispatch, useSelector } from 'react-redux'
// import { NavLink } from 'react-router-dom'
import './Homepage.css';
import { useEffect } from 'react';
import getAllSpots from '../../store/spots';

function Homepage() {
    // define state variables, react hooks
    const dispatch = useDispatch();
    // define use selector to listen to spots slice of state  
    const spotState = useSelector(state => state.spots);


    // create useEffect function that executes on page render 
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch])

    console.log("~homepage state.spots after use effect: ", spotState);

    return (
        // create large div containing all cards 
        <div className='the-great-outer-div-home'>
            <h1>Testing Home component baby</h1>
            <ul>
                <li>test</li>
                <li>testin it out</li>
                <li>woohoo!</li>
            </ul>
        </div>
    )
}

export default Homepage;

