import { useEffect, useState } from 'react';
import './SpotDetails.css';
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetails } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';

function reviewText (avgRating, numReviews) {
    console.log("calling reviewText helper --");
    let string = '';
    let reviews = 'reviews'
    console.log(avgRating);
    console.log(numReviews);
    if (!avgRating || !numReviews) {
        console.log("review helper ~ something is undefined");
        return 'loading...';
    }
    // change reviews to review if there is only one 
    if (numReviews === 1) {
        reviews = 'review';
    }

    // convert no-review string to 'new' 
    if (numReviews > 0) {
        // convert avgRating to int then to Fixed(1)
        let intRating = parseInt(avgRating);
        let fixedRating = intRating.toFixed(1);
        string = `${fixedRating}   ${numReviews} ${reviews}`;
        console.log(string);
    } else {
        string = 'New   no reviews';
    }

    return string;
}

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    console.log("~SpotDetails ~ spotId from useParams: ", spotId);
    const spotState = useSelector((state) => state.spots.spot);
    // create a loaded state 
    const [done, setDone] = useState(false);

    if(!done) {
        console.log("done state is falsy -- data has not loaded. Mounting component");
    } else {
        console.log("done state reading truthy -- data aquired [allegedly]");
    }



    useEffect(() => {
        console.log("spotDetails component ~ useEffect executing...");
        dispatch(getSpotDetails(spotId)).then(setDone(true));
    }, [dispatch]);

    console.log("~spotDetails : spotState is reading as: ", spotState);


    // handle reserve button click 
    const handleReserveClick = () => {
        alert("Feature coming soon!");
    }
    // place spot image urls into an array for rendering
    let images = [];
    // images = spotState.SpotImages;

    // temp hard code for formatting !
    images[0] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    images[1] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    images[2] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    images[3] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    images[4] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};

    // TO-DO: create review state & pull reviews for spot by id
   
    return (
        <>
            { !done ? 
                <h1>Loading!</h1>
            :
            <div className='spotDetails-outerDiv'>
                <div className='spotDetails-sectionOne'>
                    <div className='spotDetails-title'>
                        <h1>{spotState?.name}</h1>
                        <h4>{`${spotState?.city}, ${spotState?.state}, ${spotState?.country}`}</h4>
                    </div>
                    <div className='spotDetails-imageContainer'>
                        <div className='primary-image'>
                            <img src={images[0].url} alt={images[0].alt} className='primary-image-img'/>
                        </div>
                        <div className='secondary-images'>
                            <div className='quad'>
                             {images[1] && <img src={images[1].url} alt={images[1].alt} className='seconary-image'/>}
                            </div>
                            <div className='quad'>
                              {images[2] && <img src={images[2].url} alt={images[2].alt} className='seconary-image'/>}
                            </div>
                            <div className='quad'>
                              {images[3] && <img src={images[3].url} alt={images[3].alt} className='seconary-image'/>}
                            </div>
                            <div className='quad'>
                              {images[4] && <img src={images[4].url} alt={images[4].alt} className='seconary-image'/>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='spotDetails-sectionTwo'>
                    <div className='spotDetails-detailsContainer'>
                        <h3>{`Hosted by ${spotState?.Owner?.firstName} ${spotState?.Owner?.lastName}`}</h3>
                        <p>{spotState?.description}</p>
                    </div>
                    <div className='reserveContainer'>
                        <div className='reserveCard'>
                            <div className='reserveCard-info'>
                                <div className='price'>
                                     <p id='bigPrice'>{`$${spotState?.price}`}</p>
                                     <p id='night'>night</p>
                                </div>
                                <div className='reviewinfo'>
                                     <p><BsStarFill />{reviewText(spotState?.avgStarRating, spotState?.numReviews)}</p>
                                </div>
                                
                            </div>
                            <button className='reserveButton' onClick={handleReserveClick}>Reserve</button>
                        </div>
                    </div>
                </div>
                <div className='spotDetails-sectionThree'>
                    <div className='spot-details-review-forum-title'>
                        <h2><BsStarFill />{`${spotState?.avgStarRating} - ${spotState?.numReviews} reviews`}</h2>
                        <ul>
                            <li>TO-DO: array.map div element for each review</li>
                        </ul>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default SpotDetails;