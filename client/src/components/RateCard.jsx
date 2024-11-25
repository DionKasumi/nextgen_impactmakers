/* eslint-disable react/prop-types */
import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    TextField,
    Fade,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

const RateCard = ({
    id,
    card_title,
    card_source,
    card_duration,
    card_description,
    card_price,
    card_img,
    card_type,
}) => {
    const { t } = useTranslation();

    const [heart, setHeart] = useState(false);
    const [rateModalOpen, setRateModalOpen] = useState(false);
    const [rating, setRating] = useState(0); // State to store the rating

    const navigate = useNavigate();

    const handleClick = () => {
        if (card_type == undefined) {
            return;
        }
        navigate(`/${card_type}/${id}`);
    };

    const handleRateClick = (event) => {
        event.stopPropagation();
        setRateModalOpen(!rateModalOpen);
        setRating(0);
    };

    const handleStarClick = (index) => {
        setRating(index + 1); // Set the rating based on the star's index (1 to 5)
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#4F1ABE',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
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
                    <div className="flex w-full h-1/4 items-center flex-row">
                        <button
                            onClick={handleRateClick}
                            className="bg-[#50BACF] text-xs text-black w-2/4 lg:w-2/6 h-full font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all"
                        >
                            {t('card.button-rate')}
                        </button>
                    </div>
                </div>
            </div>
            <Modal open={rateModalOpen} onClose={handleRateClick}>
                <div>
                    <Fade in={rateModalOpen}>
                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-11/12 sm:w-2/4 md:w-1/3 bg-white shadow-lg rounded-md flex flex-col justify-center p-8">
                            <h1 className="font-bold text-xl">
                                {t('card.rate-text')}
                            </h1>
                            <TextField
                                id="review"
                                label={t('card.your-review')}
                                multiline
                                maxRows={2}
                                sx={{ marginY: '1.5rem' }}
                            />
                            <div className="flex flex-row justify-between items-center w-full h-auto mb-8">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleStarClick(index)}
                                        className="cursor-pointer"
                                    >
                                        {index < rating ? (
                                            <IoMdStar className="scale-[2] hover:scale-[2.3] transition-transform" />
                                        ) : (
                                            <IoMdStarOutline className="scale-[2] hover:scale-[2.3] transition-transform" />
                                        )}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button className="bg-[#50BACF] text-sm text-black px-10 py-2 font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all">
                                    {t('card.save-changes')}
                                </button>
                            </div>
                        </div>
                    </Fade>
                </div>
            </Modal>
        </ThemeProvider>
    );
};

export default RateCard;
