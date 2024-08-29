/* eslint-disable react/prop-types */
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';

const Card = ({ card_title, card_img, card_duration }) => {
    const [heart, setHeart] = useState(false);
    return (
        <div className="w-80 xl:w-96 h-80 xl:h-96 bg-white rounded-[18px] p-3 hover:scale-[102%] transition-all box-border">
            <div className="w-full h-4/6 bg-gray-400 flex justify-center items-center rounded-md relative">
                {/* Upper div - Image */}
                {card_img != null ? (
                    <div
                        className="w-full h-full bg-center bg-cover rounded-md"
                        style={{
                            backgroundImage: `url(${card_img})`,
                        }}
                    ></div>
                ) : (
                    <img
                        src="../assets/no_image.svg"
                        alt="No Image Available"
                    />
                )}
                {!heart ? (
                    <GoHeart
                        onClick={() => setHeart(true)}
                        className="absolute right-5 bottom-5 scale-[2] text-[#EA2727] origin-center hover:scale-[2.2] transition-all hover:cursor-pointer"
                    />
                ) : (
                    <GoHeartFill
                        onClick={() => setHeart(false)}
                        className="absolute right-5 bottom-5 scale-[2] text-[#EA2727] origin-center hover:scale-[2.2] transition-all hover:cursor-pointer"
                    />
                )}
            </div>
            <div className="w-full h-2/6 flex justify-between flex-col">
                {/* Lower div - Card info */}
                <div className="mt-2">
                    <h4 className="text-sm font-bold">{card_title}</h4>
                    <p className="text-xs italic">{card_duration}</p>
                </div>
                <button className="bg-[#50BACF] text-xs text-black w-2/6 h-1/4 font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all">
                    Expore More
                </button>
            </div>
        </div>
    );
};

export default Card;
