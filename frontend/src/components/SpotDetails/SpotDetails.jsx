import { useEffect } from 'react';
import './SpotDetails.css';
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetails } from '../../store/spots';
// import { BsStarFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';

function SpotDetails () {
    const dispatch = useDispatch();
    const spotState = useSelector((state) => state.spots.spot);
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);

    console.log("spotState is (drumroll please!) ....", spotState);

    return (
        <>
            <h1>SPOT Details henny!</h1>
        </>
    )
}

export default SpotDetails;