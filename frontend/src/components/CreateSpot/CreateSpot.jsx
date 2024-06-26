import { useDispatch, useSelector } from 'react-redux'
import './CreateSpot.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { createASpot, getSpotDetails, updateASpot} from '../../store/spots';
import { useEffect, useState } from 'react';


function CreateSpot () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.session.user);
    const location = useLocation();
    const url = location.pathname;
    const isEdit = (url.includes("edit"));
    const [errorClass, setErrorClass] = useState('hidden');
    // const oldSpot = useSelector((state) => state);
    let title = 'Create a New Spot';
    let buttonText = 'Create Spot';
    // will be undefined w create route
    const pathArray = url.split('/');
    const id = pathArray[2];

    // differentiate between edit & create 
    if(isEdit) {
        // change title to update
        title = 'Update your Spot';
        buttonText = 'Update your Spot';
    }
   
    // define all states 
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState(89);
    const [lng, setLng] = useState(179);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [spotImageOne, setSpotImageOne] = useState('');
    const [spotImageTwo, setSpotImageTwo] = useState('');
    const [spotImageThree, setSpotImageThree] = useState('');
    const [spotImageFour, setSpotImageFour] = useState(''); 
    const [errors, setErrors] = useState({});

    // Create a useEffect for monitoring validations 
    useEffect(() => {
        // create error obj
        const errorsObj = {}; 
        if (!currentUser) {
            navigate('/');
        }
        // location validations
        if (!country) errorsObj.country = "Country is required";
        if (!address) errorsObj.address = "Address is required";
        if (!city) errorsObj.city = "City is required";
        if (!state) errorsObj.state = "State is required"
        // description validation
        if (!description || description.length < 30) errorsObj.description = "Description needs a minimum of 30 characters";
        // title validation
        if (!name) errorsObj.name = "Name is required";
        // price validation
        if(!price) errorsObj.price = "Price is required";
        // image validations 
        if (!mainImage) errorsObj.mainImage = "Preview image is required";
        if (mainImage.length && !(mainImage.endsWith('.png') || mainImage.endsWith('.jpg') || mainImage.endsWith('.jpeg'))) errorsObj.mainImage = "Image URL needs to end in png, jpg, or jpeg";
        if (spotImageOne.length && !(spotImageOne.endsWith('.png') || spotImageOne.endsWith('.jpg') || spotImageOne.endsWith('.jpeg'))) errorsObj.spotImageOne = "Image URL needs to end in png, jpg, or jpeg";
        if (spotImageTwo.length && !(spotImageTwo.endsWith('.png') || spotImageTwo.endsWith('.jpg') || spotImageTwo.endsWith('.jpeg'))) errorsObj.spotImageTwo = "Image URL needs to end in png, jpg, or jpeg";
        if (spotImageThree.length && !(spotImageThree.endsWith('.png') || spotImageThree.endsWith('.jpg') || spotImageThree.endsWith('.jpeg'))) errorsObj.spotImageThree = "Image URL needs to end in png, jpg, or jpeg";
        if (spotImageFour.length && !(spotImageFour.endsWith('.png') || spotImageFour.endsWith('.jpg') || spotImageFour.endsWith('.jpeg'))) errorsObj.spotImageFour = "Image URL needs to end in png, jpg, or jpeg";

        // update errors state
        setErrors(errorsObj);

    }, [address, city, state, country, lat, lng, name, description, price, mainImage, spotImageFour, spotImageOne, spotImageThree, spotImageTwo, currentUser, navigate])

  
    // create a useEffect to summon current spot if an edit route 
    useEffect(() => {
        if(isEdit) {
            // dispatch to get a spot with id 
            dispatch(getSpotDetails(id)).then((spot) => {

                // then set states to return object --> 
                setAddress(spot.address);
                setCity(spot.city);
                setState(spot.state);
                setCountry(spot.country);
                setName(spot.name);
                setDescription(spot.description);
                setPrice(spot.price);        
                
                // handle images 
                let secondaryImages = [];
                spot.SpotImages.forEach((img) => {
                    // set the main image if preview is true, or push 2ndaries into array
                    if (img.preview === true) {
                        setMainImage(img.url);
                    } else if (img.url.length) {
                        secondaryImages.push(img.url);
                    }
                });
                // set states of secondary images if they exist
                if (secondaryImages[0]) setSpotImageOne(secondaryImages[0]);
                if (secondaryImages[1]) setSpotImageTwo(secondaryImages[1]);
                if (secondaryImages[2]) setSpotImageThree(secondaryImages[2]);
                if (secondaryImages[3]) setSpotImageFour(secondaryImages[3]);

            })
        }
    }, [dispatch, isEdit, id])

    // Create HandleSubmit function & dispatch 
    const handlesubmit = async (e) => {
        e.preventDefault();

        setLat(88);
        setLng(100);

        if (Object.values(errors).length) {
            setErrorClass('error-msg');
            return;
        }
        // create new spot object from states 
        const newSpot = {
            ownerId: currentUser.id,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat,
            lng
        }

        // create object holding spot images 
        const spotImages = {
            spotImageOne,
            spotImageTwo,
            spotImageThree,
            spotImageFour
        }

        // IF CREATE
        // dispatch spot object, main image, and image object to createASpot thunk 
        if (!isEdit) {

            // const createdSpot = await 
            dispatch(createASpot(newSpot, mainImage, spotImages)).then((createdSpot) => {
                if (createdSpot.id) navigate(`/spots/${createdSpot.id}`);
                else alert("sorry, that didn't work!");
            })
            
        }

        // IF UPDATE 
        // dispatch spot object, main image, and image object to updateASpot thunk 
        if (isEdit) {
            dispatch(updateASpot(newSpot, id, mainImage, spotImages)).then((createdSpot) => {
                navigate(`/spots/${createdSpot.id}`);
            });
        }

    }

    
    const maxChar = 200;
    const descriptionHelper = (e) => {
        const newText = e.target.value;
        if (newText.length <= maxChar) {
            setDescription(newText);
        }
    }
        
    // create a dynamic form return for create or edit 
    return (
        <div className='createSpot-page'>
            <div className='createSpot-outerDiv'>
                <div className='headers'>
                    <h1>{title}</h1>
                    <h3>Where&apos;s your place located?</h3>
                    <p>Guests will only get your exact address once they book a reservation.</p>
                </div>
                <form onSubmit={handlesubmit}>
                    <div className='location-section'>
                        <label>
                            <div className='error-container'>
                                <p>Country</p> {errors.country && <p className={errorClass}>{errors.country}</p>}
                            </div>
                            <input 
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className='normal-input'
                                placeholder='Country'
                            />
                        </label>
                        <label>
                            <div className='error-container'>
                                <p>Street Address</p>
                                {errors.address && <p className={errorClass}>{errors.address}</p>}
                            </div>
                            <input 
                                type='text'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className='normal-input'
                                placeholder='Address'
                            />
                        </label>
                        <div className='cite-state-container'>
                            <label className='city-label'>
                                <div className='error-container'>
                                    <p>City</p>
                                    {errors.city && <p className={errorClass}>{errors.city}</p>}
                                </div>
                                <input
                                    type='text'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder='City'
                                    className='city-state-input'
                                />
                            </label>
                            <label className='state-label'>
                                <div className='error-container'>
                                    <p>State</p>
                                    {errors.state && <p className={errorClass}>{errors.state}</p>}
                                </div>
                                <input 
                                    type='text'
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder='State'
                                    className='city-state-input'
                                />
                            </label>
                        </div>
                    </div>
                    <div className='spot-description-container'>
                        <h3>Describe your place to guests</h3>
                        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <div className='charLimit'>
                            {maxChar - description.length} characters remaining
                        </div>
                        <textarea 
                            id='desc-textarea'
                            type='text'
                            value={description}
                            onChange={descriptionHelper}
                            placeholder='Please write at least 30 characters'
                        />
                        {errors.description && <p className={errorClass}>{errors.description}</p>}
                    </div>

                    <div className='spot-title-container'>
                        <h3>Create a title for your spot</h3>
                        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                        <input 
                            id='titleinput'
                            type='text'
                            value={name}
                            placeholder='Name of your spot'
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                    </div>
                    <div className='price-input-container'>
                        <h3>Set a base price for your spot</h3>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <label>
                            <div className='dollar-plus-input'>
                                <p>$</p>
                                <input
                                    type='text'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder='Price per night (USD)'   
                                />
                                </div>
                                {errors.price && <p className={errorClass}>{errors.price}</p>}
                        </label>
                            </div>

                    
                        
                            
                    
                    <div className='image-input-container'>
                        <h3>Liven up your spot with photos</h3>
                        <p>Submit a link to at least one photo to publish your spot.</p>
                        <label>
                            <input 
                                type='text'
                                value={mainImage}
                                onChange={(e) => setMainImage(e.target.value)}
                                placeholder='Preview Image URL'
                            />
                            {errors.mainImage && <p className={errorClass}>{errors.mainImage}</p>}
                        </label>
                        <div className='secondary-image-inputs'>
                            <label>
                                <input
                                    className='imageUrls' 
                                    type='text'
                                    value={spotImageOne}
                                    onChange={(e) => setSpotImageOne(e.target.value)}
                                    placeholder='image URL'
                                />
                                {errors.spotImageOne && <p className={errorClass}>{errors.spotImageOne}</p>}
                            </label>
                            <label>
                                <input
                                    className='imageUrls' 
                                    type='text'
                                    value={spotImageTwo}
                                    onChange={(e) => setSpotImageTwo(e.target.value)}
                                    placeholder='image URL'
                                />
                                {errors.spotImageTwo && <p className={errorClass}>{errors.spotImageTwo}</p>}
                            </label>
                            <label>
                                <input
                                    className='imageUrls' 
                                    type='text'
                                    value={spotImageThree}
                                    onChange={(e) => setSpotImageThree(e.target.value)}
                                    placeholder='image URL'
                                />
                                {errors.spotImageThree && <p className={errorClass}>{errors.spotImageThree}</p>}
                            </label>
                            <label>
                                <input
                                    className='imageUrls' 
                                    type='text'
                                    value={spotImageFour}
                                    onChange={(e) => setSpotImageFour(e.target.value)}
                                    placeholder='image URL'
                                />
                                {errors.spotImageFour && <p className={errorClass}>{errors.spotImageFour}</p>}
                            </label>
                        </div>
                    </div>
                    <div className='submit-button-container'>
                        <button className='submit-button'
                        type="submit"
                        >{buttonText}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSpot;