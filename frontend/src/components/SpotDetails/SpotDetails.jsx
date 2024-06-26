import { useEffect, useState } from 'react';
import './SpotDetails.css';
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetails } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";
import { useParams } from 'react-router-dom';
import { getAllReviewsThunk } from '../../store/reviews';
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal';
import OpenModalButton from '../OpenModalButton';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';

// HELPER FUNCTION FOR FORMATTING AVG RATING 
function reviewText (avgRating, numReviews) {
    let string = '';
    let reviews = 'reviews'

    if (!avgRating || !numReviews) {
        string = 'loading...';
    }
    // change reviews to review if there is only one 
    if (numReviews === 1) {
        reviews = 'review';
    }

    // convert no-review string to 'new' 
    if (numReviews > 0) {
        // convert avgRating to int then to Fixed(1)
        let intRating = parseFloat(avgRating);
        let fixedRating = intRating.toFixed(1);
        string = `${fixedRating}  ·  ${numReviews} ${reviews}`;
    } else {
        string = 'New';
    }

    return string;
}


// COMPONENT FUNCTION 
function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spotState = useSelector((state) => state.spots.spot);
    const currentUser = useSelector((state) => state.session.user);
    // create a "loaded" state 
    const [done, setDone] = useState(false);

    // GET SPOTS & GET REVIEWS 
    useEffect(() => {
        dispatch(getSpotDetails(spotId)).then(()=> {
            dispatch(getAllReviewsThunk(spotId));
        });
    }, [dispatch, spotId]);

    // CLOSE CIRCUIT WHEN SPOT POPULATED
    useEffect(() => {
        setTimeout(() => {
            if (spotState) setDone(true);
        }, 20);
    }, [spotState]);



    // handle reserve button click 
    const handleReserveClick = () => {
        alert("Feature coming soon!");
    }

    // SPOT IMAGES 
    let images = [];
    if (spotState) {
        images = spotState.SpotImages;
    }
    

    // temp hard code for formatting !
    // images[0] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    // images[1] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    // images[2] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    // images[3] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};
    // images[4] = {url: "https://t3.ftcdn.net/jpg/06/01/84/12/360_F_601841290_YQ6SA4KGRPE44WWlUQngWMvB2cqKiWRz.jpg", alt: "pink house exterior"};

    // REVIEWS 
    // dispatch to reviews thunk / create reviews slice of state
    const reviewsState = useSelector((state) => Object.values(state.reviews));
    // create an array of reviews, re-order them oldest to newest (.reverse()?)
    const reviewsArr = [...reviewsState].reverse();

    // DATE FORMATTING HELPER 
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    function formatDates (createdAt) {
        let string = '';
        if (createdAt) {
            let month = new Date(createdAt).getMonth();
            month = months[month];

            let year = new Date(createdAt).getFullYear();

            string = `${month} ${year}`;
        }
        return string; 
    }

    // check if user has already reviewed this spot 
    const hasReviewed = reviewsState?.some(review => review.userId === currentUser?.id);
   
    return (
        <>
            { !done ? 
                <h1 className='loading-screen'>Loading!</h1>
            :
            <div className='spotDetails-outerDiv'>
                <div className='spotDetails-sectionOne'>
                    <div className='spotDetails-title'>
                        <h1>{spotState?.name}</h1>
                        <h4>{`${spotState?.city}, ${spotState?.state}, ${spotState?.country}`}</h4>
                    </div>
                    <div className='spotDetails-imageContainer'>
                        <div className='primary-image'>
                            {spotState &&   <img src={images[0].url} alt={images[0].alt} className='primary-image-img'/>}
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
                        <h2><BsStarFill />{reviewText(spotState?.avgStarRating, spotState?.numReviews)}</h2>
                    </div>
                    {currentUser && currentUser?.id !== spotState?.Owner?.id && !hasReviewed && <OpenModalButton
                                className='post-review-button'
                                modalComponent={<CreateReviewModal spot={spotState} />}
                                buttonText="Post Your Review" /> }
                    {currentUser && currentUser?.id !== spotState?.Owner?.id && !reviewsArr.length && <p>Be the first to post a review!</p>}
                    {(reviewsArr.length > 0) && reviewsArr.map((review) => (
                        <div key={review.id} className='review-container'>
                            <p className='review-name'>{review?.User?.firstName}</p>
                            <p className='review-date'>{formatDates(review?.createdAt)}</p>
                            <p className='review-body'>{review?.review}</p>
                            {review.userId === currentUser?.id && <DeleteReviewModal reviewId={review.id} spotId={spotState?.id}/>
                            }
                        </div>
                    ))}
                </div>
            </div>
        }
        </>
    )
}

export default SpotDetails;