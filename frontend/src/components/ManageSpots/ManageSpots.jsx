import { useEffect } from "react";
// import { BsStarFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
// import { getSpotsByCurrentUser } from "../../store/spots";
// import useState

function ManageSpots () {
    const dispatch = useDispatch(); 
    // declare states and hooks 

    // create a useEffect to gen spots by c.u. 
    useEffect(() => {
        console.log("~manageSpots useEffect")
    }, [dispatch]);

    return (
        <>
            <h1>Manage yer spots!</h1>
            <ul>
                <li>u could manage this one</li>
                <li>or this one</li>
                <li>or maybe this one</li>
            </ul>
        </>
    );
}

export default ManageSpots;