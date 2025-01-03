/* eslint-disable react-refresh/only-export-components */
import SectionWrapper from '../hoc/SectionWrapper';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';
import SwiperCarousel from '../components/SwiperCarousel';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useTranslation } from 'react-i18next';

// Function to fetch course data from the API
const fetchCourse = async (id) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/internships/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching internship with id-${id}:`, error);
        return [];
    }
};

const TestimonialCard = () => {
    return (
        <div className="bg-[#44FFD1] w-full sm:w-3/4 md:w-2/4 h-auto p-6 flex flex-row justify-center items-center gap-10">
            {/* Testimonial Card */}
            <div className="font-bold">
                <h2>Surname</h2>
            </div>
            <div>
                <p className="text-sm mb-2 text-wrap text-ellipsis overflow-hidden whitespace-nowrap line-clamp-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo ratione eligendi dignissimos tempora adipisci, ullam
                    autem ad praesentium aspernatur.
                </p>
                <div className="flex flex-row">
                    <IoMdStar className="scale-150 mr-1" />
                    <IoMdStar className="scale-150 mx-1" />
                    <IoMdStar className="scale-150 mx-1" />
                    <IoMdStar className="scale-150 mx-1" />
                    <IoMdStarOutline className="scale-150 ml-1" />
                </div>
            </div>
        </div>
    );
};

const InternshipDetailsPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [ticketCount, setTicketCount] = useState(0);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applied, setApplied] = useState(null);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    const handleApplyModalToggle = () => {
        setApplyModalOpen(!applyModalOpen);
    };
    const handleButtonChange = (value) => {
        setApplied(value);
    };

    const handleSubmit = async () => {
        if (applied === null) {
            setErrorMessage('Let us know if you have applied!');
            return;
        }

        if (applied === false) {
            handleApplyModalToggle();
            setErrorMessage('');
            return;
        }

        if (alreadyApplied) {
            alert('You have already applied to this internship.');
            handleApplyModalToggle();
            return;
        }

        try {
            await axios.post(
                'http://localhost:8080/api/applications/add',
                {
                    card_id: course.id,
                    card_type: 'all_internships',
                },
                {
                    withCredentials: true,
                }
            );
            navigate('/profile/myapp'); // Redirect after submission
        } catch (error) {
            console.error('Error saving application:', error);
            setErrorMessage('Failed to save application. Please try again.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCourse(id);
            setCourse(data);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const endpoint = `http://localhost:8080/api/internships`;

                const response = await axios.get(endpoint);

                // Access the `data` field, not the entire response
                if (
                    response.status === 200 &&
                    Array.isArray(response.data.data)
                ) {
                    const gatheredData = response.data.data
                        .slice(0, 5) // Slice the first 5 items from the `data` array
                        .map((item) => ({ ...item, type: 'internships' })); // Add `type` field
                    setCarouselData(gatheredData);
                } else {
                    console.error(
                        'Invalid response format. Expected an array.'
                    );
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        const fetchFavoriteIds = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/favorites'
                );
                if (response.status === 200) {
                    setFavoriteIds(response.data.map((fav) => fav.card_id));
                }
            } catch (error) {
                console.error('Error fetching favorite IDs:', error);
            }
        };

        fetchFavoriteIds();
        fetchCarouselData();
    }, []);

    const [carouselData, setCarouselData] = useState([]);

    const { t } = useTranslation();

    return (
        <>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="w-full min-h-svh items-center flex flex-col relative top-16 mb-10">
                    <div className="w-full h-full py-12 flex justify-center items-center flex-col">
                        <div
                            className={`w-5/6 aspect-[16/5] flex justify-center items-center rounded-md relative mb-16 ${
                                course.image_url == null ? 'bg-gray-400' : ''
                            }`}
                        >
                            {course.image_url == null ? (
                                <img
                                    src="../assets/no_image.svg"
                                    alt="No Image Available"
                                    className="select-none w-1/4 h-1/4 lg:w-1/5 lg:h-1/5"
                                />
                            ) : (
                                <img
                                    src={course.image_url}
                                    alt="Course Image"
                                    className=" h-full w-auto max-w-full max-h-full object-cover lg:object-contain"
                                />
                            )}
                        </div>

                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                {t('pages.general-text.evit-details.position')}
                            </h1>
                            {course.title ? (
                                <p className="text-center w-full md:w-1/2">
                                    {course.title}
                                </p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                    Visit{' '}
                                    <span
                                        className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                        onClick={() =>
                                            (window.location.href =
                                                course.apply_link)
                                        }
                                    >
                                        Source
                                    </span>{' '}
                                    for more information.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                {t('pages.evit-details.internships.text-1')}
                            </h1>
                            {course.description ? (
                                <p className="text-center w-full md:w-1/2">
                                    {course.description}
                                </p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                    Visit{' '}
                                    <span
                                        className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                        onClick={() =>
                                            (window.location.href =
                                                course.apply_link)
                                        }
                                    >
                                        Source
                                    </span>{' '}
                                    for more information.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                {t('pages.evit-details.internships.text-4')}
                            </h1>
                            {course.label ? (
                                <p className="text-center w-full md:w-1/2">
                                    {course.label}
                                </p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                    Visit{' '}
                                    <span
                                        className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                        onClick={() =>
                                            (window.location.href =
                                                course.apply_link)
                                        }
                                    >
                                        Source
                                    </span>{' '}
                                    for more information.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Internship Details Section */}
                    <div className="w-full h-full py-24 flex justify-center items-center flex-col bg-custom-gradient-3 relative">
                        <div
                            className="absolute  inset-0 hidden sm:block bg-no-repeat bg-left bg-contain"
                            style={{
                                backgroundImage: "url('../assets/image12.png')",
                            }}
                        ></div>

                        {course.posted_date &&
                            course.posted_date !== 'Unknown' && (
                                <div className="w-5/6 text-white flex flex-col items-center mb-6">
                                    <h1 className="text-3xl font-bold">
                                        {t(
                                            'pages.general-text.evit-details.last-day-to-apply'
                                        )}
                                    </h1>
                                    <p>{course.posted_date}</p>
                                </div>
                            )}
                        {course.location && course.location !== 'Unknown' && (
                            <div className="w-5/6 text-white flex flex-col items-center mb-6">
                                <h1 className="text-3xl font-bold">
                                    {t(
                                        'pages.general-text.evit-details.location'
                                    )}
                                </h1>
                                <p>{course.location}</p>
                            </div>
                        )}
                        {course.salary && course.salary !== 'Unknown' && (
                            <div className="w-5/6 text-white flex flex-col items-center mb-6">
                                <h1 className="text-3xl font-bold">
                                    {t(
                                        'pages.general-text.evit-details.salary'
                                    )}
                                </h1>
                                <p>{course.salary}</p>
                            </div>
                        )}
                        {course.source && course.source !== 'Unknown' && (
                            <div className="w-5/6 text-white flex flex-col items-center mb-6">
                                <h1 className="text-3xl font-bold">
                                    {t(
                                        'pages.general-text.evit-details.source'
                                    )}
                                </h1>
                                <p>{course.source}</p>
                            </div>
                        )}
                        <a
                            className="px-16 py-6 bg-white text-black font-bold text-xl rounded-lg hover:scale-105 transition-all z-10"
                            href={course.apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setApplyModalOpen(true)}
                        >
                            {t('pages.general-text.evit-details.apply-here')}
                        </a>
                    </div>
                    {/* Source of this Opportunity Content Div */}
                    <div className="w-full h-full py-24 bg-[url('/assets/registered.png')] flex justify-center items-center flex-col bg-no-repeat bg-cover">
                        <h1 className="font-bold text-2xl mb-12 -mt-12">
                            {t(
                                'pages.general-text.evit-details.source-of-this-opportunity'
                            )}
                        </h1>
                        <div className="flex flex-col bg-[#A3A9FE] w-full  md:w-4/6 h-auto p-3  justify-center items-center gap-10">
                            <img
                                src={course.image_url}
                                alt="Course Image"
                                className="w-auto h-full mt-20 object-cover rounded-md select-none"
                            />
                            <div className="w-5/6 justify-center items-center flex flex-col py-12">
                                <h3 className="text-white">
                                    {course.source
                                        ? course.source
                                        : 'No Source'}
                                </h3>
                                <div className="flex flex-col mt-10">
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        {course.email}
                                    </button>
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        {course.phone_number}
                                    </button>
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        {course.office_address}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Testimonials Content Div */}
                        <h1 className="font-bold text-2xl mb-12 mt-20">
                            {t('pages.general-text.evit-details.testimonials')}
                        </h1>
                        <div className="w-2/3 h-auto flex flex-col xl:flex-row justify-between items-center gap-5 mb-16">
                            <TestimonialCard />
                            <TestimonialCard />
                            <TestimonialCard />
                        </div>
                    </div>
                    <div className="w-full h-auto py-24 flex justify-center items-center flex-col bg-[#4F1ABE] bg-[url('../assets/image11.png')] bg-no-repeat text-white">
                        {/* Carousel Div */}
                        <div className="flex flex-col justify-center items-center mb-16">
                            <h1 className="font-bold text-2xl mb-4">
                                {t(
                                    'pages.evit-details.internships.explore-similar-internships'
                                )}
                            </h1>
                            <p className="font-light text-lg">
                                {t(
                                    'pages.general-text.evit-details.find-your-next-opportunity'
                                )}
                            </p>
                        </div>
                        <div className="w-full h-full">
                            {/* Carousel */}
                            <SwiperCarousel
                                data={carouselData}
                                favoriteIds={favoriteIds}
                            />
                        </div>
                        <div className="w-3/4">
                            <a
                                href="/internships"
                                className="font-light text-lg"
                            >
                                {t(
                                    'pages.evit-details.internships.go-back-to-all-internships'
                                )}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={applyModalOpen} onClose={handleApplyModalToggle}>
                <div>
                    <Fade in={applyModalOpen}>
                        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
                            <div className="relative w-full max-w-lg bg-white shadow-lg rounded-3xl flex flex-col justify-center p-8">
                                <h1 className="text-black text-2xl mb-6 text-center">
                                    {t('pages.general-text.did-you-apply')}
                                </h1>
                                <div className="flex flex-col items-center space-y-4 mb-6">
                                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                        <button
                                            onClick={() =>
                                                handleButtonChange(true)
                                            }
                                            className={`relative uppercase px-6 py-2 rounded-md transition-all border-transparent border-[3px] duration-300 bg-[#85d855] text-white hover:scale-105 ${
                                                applied
                                                    ? 'border-green-600'
                                                    : ''
                                            }`}
                                        >
                                            {t('pages.general-text.yes')}
                                        </button>
                                        <p>{t('pages.general-text.or')}</p>
                                        <button
                                            onClick={() =>
                                                handleButtonChange(false)
                                            }
                                            className={`relative uppercase px-6 py-2 rounded-md transition-all border-transparent border-[3px] duration-300 bg-[#FF7777] text-white hover:scale-105 ${
                                                !applied ? 'border-red-600' : ''
                                            }`}
                                        >
                                            {t('pages.general-text.no')}
                                        </button>
                                    </div>
                                </div>
                                {errorMessage && (
                                    <p className="text-red-500 text-center mb-4">
                                        {errorMessage}
                                    </p>
                                )}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-[#4F1ABE] text-white text-lg py-2 w-1/2 rounded-lg hover:scale-105 transition-transform"
                                    >
                                        <span>
                                            {t('pages.general-text.submit')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Fade>
                </div>
            </Modal>
        </>
    );
};

export default SectionWrapper(InternshipDetailsPage);
