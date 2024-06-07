import { useState } from "react";

function StarModalComponent ({ stars, setStars }) {
    const [currentRating, setCurrentRating] = useState(0);

    const handleRatingClick = (rating) => {
        setCurrentRating(rating);
        setStars(rating);
    }

    const renderStars = () => {
        const starsArr = [];
        
        for (let i = 1; i <= 5; i++) {
            starsArr.push(
                <div
                    key={i}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => setCurrentRating(i)}
                    onMouseLeave={() => setCurrentRating(stars)}
                >
                <i className={`fa-${currentRating >= i ? "solid" : "regular"} fa-star`}></i>
                </div>
            )
        }
        return starsArr;
    };

    return (
        <>
            <div className="stars-container">
                {renderStars()} Stars
            </div>
        </>
    )
}

export default StarModalComponent;