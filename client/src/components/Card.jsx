import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Card = ({
    id,
    card_title,
    card_source,
    card_duration,
    card_description,
    card_price,
    card_img,
    card_type,
    isFavorite,
    onToggleFavorite,
}) => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(isFavorite);

    const toggleHeart = () => {
        setFavorite(!favorite);
        onToggleFavorite(id);
    };

    const handleClick = () => {
        if (!card_type) return;
        navigate(`/${card_type}/${id}`);
    };

    return (
        <div
            className="w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-white rounded-[16px] lg:rounded-[20px] xl:rounded-[24px] p-2 lg:p-3 xl:p-4 hover:scale-[102%] transition-all box-border select-none shadow-lg z-50"
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
                    >
                        <div className="w-full h-full bg-gradient-to-t from-[#4F1ABE] rounded-md select-none"></div>
                    </div>
                ) : (
                    <img
                        src="../assets/no_image.svg"
                        alt="No Image Available"
                        className="select-none w-1/3 h-1/3 lg:w-1/2 lg:h-1/2"
                    />
                )}
                <div className="flex w-full h-auto flex-row justify-between items-center absolute bottom-0 py-2 lg:py-5 px-2 lg:px-6">
                    <p className="text-sm lg:text-lg text-white">
                        {card_price != null && card_price != 'N/A' ? (
                            <>
                                {t('card.price')}
                                <span className="text-green-700 font-bold text-sm lg:text-lg">
                                    {card_price}
                                </span>
                            </>
                        ) : (
                            <>
                                {t('card.price')}
                                <span className="text-green-700 font-bold text-sm lg:text-lg">
                                    --
                                </span>
                            </>
                        )}
                    </p>
                    {isFavorite ? (
                        <GoHeartFill
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleHeart();
                            }}
                            className="scale-125 lg:scale-[2] text-[#EA2727] origin-center hover:scale-[1.45] lg:hover:scale-[2.2] transition-all hover:cursor-pointer"
                        />
                    ) : (
                        <GoHeart
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleHeart();
                            }}
                            className="scale-125 lg:scale-[2] text-[#EA2727] origin-center hover:scale-[1.45] lg:hover:scale-[2.2] transition-all hover:cursor-pointer"
                        />
                    )}
                </div>
            </div>
            <div className="w-full h-2/6 flex justify-between flex-col">
                {/* Lower div - Card info */}
                <div className="mt-1 lg:mt-2">
                    <div className="flex flex-row justify-between items-center">
                        <h4 className="text-xs lg:text-sm font-bold text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                            {card_title ? card_title : t('card.notitle')}
                        </h4>
                        <p className="text-xs lg:text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                            {card_source ? card_source : t('card.nosource')}
                        </p>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-600 text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-2">
                        {card_description
                            ? card_description
                            : t('card.nodescription')}
                    </p>
                </div>
                <div className="flex w-full h-1/4 justify-between items-center flex-row">
                    <button className="bg-[#50BACF] text-xs text-black w-2/4 lg:w-2/6 h-full font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all">
                        {t('card.button-text')}
                    </button>
                    <p className="text-xs italic text-gray-600">
                        {card_duration ? card_duration : t('card.noduration')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Card;
