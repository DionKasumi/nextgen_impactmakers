/* eslint-disable react/prop-types */
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { useSwiperSlide } from 'swiper/react';

const CarouselCard = ({
    id,
    card_title,
    card_source,
    card_duration,
    card_description,
    card_price,
    card_img,
}) => {
    const swiperSlide = useSwiperSlide();

    const [heart, setHeart] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/courses/${id}`);
    };

    const handleHeartClick = (event) => {
        event.stopPropagation(); // Prevents event from bubbling to the parent
        setHeart(!heart);
    };

    return (
        <div
            className={`w-80 xl:w-96 h-80 xl:h-96 bg-white rounded-[24px] p-4 ${
                !swiperSlide.isActive
                    ? 'scale-75 hover:scale-[0.77]'
                    : 'scale-100 hover:scale-[102%]'
            } transition-all box-border select-none`}
            onClick={handleClick}
        >
            <div className="w-full h-4/6 bg-gray-400 flex flex-col justify-center items-center rounded-[8px] relative">
                {/* Upper div - Image */}
                {card_img != null ? (
                    <div
                        className="w-full h-full bg-center bg-cover rounded-md select-none"
                        style={{
                            backgroundImage: `url(${card_img})`,
                        }}
                    ></div>
                ) : (
                    <img
                        src="../assets/no_image.svg"
                        alt="No Image Available"
                        className="select-none"
                    />
                )}
                <div className="flex w-full h-auto flex-row justify-between items-center absolute bottom-0 p-5 px-6">
                    <p className="text-md text-white">
                        {card_price ? (
                            <>
                                Price:{' '}
                                <span className="text-green-700 font-bold text-lg">
                                    {card_price}
                                </span>
                            </>
                        ) : (
                            <>
                                Price:{' '}
                                <span className="text-green-700 font-bold text-lg">
                                    --
                                </span>
                            </>
                        )}
                    </p>
                    {!heart ? (
                        <GoHeart
                            onClick={handleHeartClick} // Handles heart click
                            className="scale-[2] text-[#EA2727] origin-center hover:scale-[2.2] transition-all hover:cursor-pointer"
                        />
                    ) : (
                        <GoHeartFill
                            onClick={handleHeartClick} // Handles heart click
                            className="scale-[2] text-[#EA2727] origin-center hover:scale-[2.2] transition-all hover:cursor-pointer"
                        />
                    )}
                </div>
            </div>
            <div className="w-full h-2/6 flex justify-between flex-col">
                {/* Lower div - Card info */}
                <div className="mt-2">
                    <div className="flex flex-row justify-between items-center">
                        <h4 className="text-sm font-bold text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                            {card_title ? card_title : 'No Title'}
                        </h4>
                        <p className="text-sm">
                            {card_source ? card_source : 'No Source'}
                        </p>
                    </div>
                    <p className="text-sm text-gray-600 text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-2">
                        {card_description ? card_description : 'No Description'}
                    </p>
                </div>
                <div className="flex w-full h-1/4 justify-between items-center flex-row">
                    <button className="bg-[#50BACF] text-xs text-black w-2/6 h-full font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all">
                        Explore More
                    </button>
                    <p className="text-xs italic text-gray-600">
                        {card_duration ? card_duration : 'No Duration'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CarouselCard;