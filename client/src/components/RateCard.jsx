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
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const RateCard = ({
    id,
    card_title,
    card_img,
    card_duration,
    card_description,
    card_price,
    card_source,
    card_type
}) => {
    console.log("RateCard Props:", { id, card_type }); // Log props received by RateCard
    const { t } = useTranslation();

    const [heart, setHeart] = useState(false);
    const [rateModalOpen, setRateModalOpen] = useState(false);
    const [rating, setRating] = useState(0); // State for rating
    const [testimonial, setTestimonial] = useState(''); // New state for testimonial

    const navigate = useNavigate();

    // Navigate to each card from My Applications
    const handleClick = () => {
        if (card_type === undefined) {
            return;
        }
        
        // Remove "all_" from card_type
        const formattedCardType = card_type.replace('all_', '');
        
        // Navigate to the formatted URL
        navigate(`/${formattedCardType}/${id}`);
    };
    

    const handleRateClick = (event) => {
        event.stopPropagation();
        setRateModalOpen(!rateModalOpen);
        setRating(0);
        setTestimonial(''); // Reset testimonial input
    };

    const handleStarClick = (index) => {
        setRating(index + 1); // Set the rating based on the star's index (1 to 5)
    };


    const handleSaveChanges = async () => {
        if (!rating || !testimonial) {
            alert("Please provide both a rating and a testimonial.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8080/api/submit_testimonial', {
                testimonial: testimonial,
                rating: rating,
                card_id: id,
                card_type: card_type
            });
    
            if (response.status === 201) {
                alert('Testimonial submitted successfully!');
                setRateModalOpen(false); // Close the modal after successful submission
            } else {
                alert(response.data.error || 'An error occurred while submitting the testimonial.');
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error.response?.data || error.message);
            alert('An error occurred while submitting the testimonial.');
        }
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
                {/* Original content left untouched */}
                <div className="w-full h-4/6 bg-gray-400 flex flex-col justify-center items-center rounded-[8px] relative">
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
                            className="select-none w-1/3 h-1/3 lg:w-1/2 lg:h-1/2"
                        />
                    )}
                </div>
                <div className="w-full h-2/6 flex justify-between flex-col">
                    <div className="mt-1 lg:mt-2">
                        <div className="flex flex-row justify-between items-center">
                            <h4 className="text-xs lg:text-sm font-bold text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                                {card_title || t('card.notitle')}
                            </h4>
                            <p className="text-xs lg:text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-1">
                                {card_source || t('card.nosource')}
                            </p>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-2">
                            {card_description || t('card.nodescription')}
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
                            value={testimonial}
                            onChange={(e) => setTestimonial(e.target.value)}
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
                            <button
                                onClick={handleSaveChanges}
                                className="bg-[#50BACF] text-sm text-black px-10 py-2 font-medium border-black border-[1px] rounded-[5px] hover:scale-105 transition-all"
                            >
                                {t('card.save-changes')}
                            </button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </ThemeProvider>
    );
};

export default RateCard;
