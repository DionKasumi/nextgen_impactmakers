/* eslint-disable react-refresh/only-export-components */
import SectionWrapper from '../hoc/SectionWrapper';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';
import SwiperCarousel from '../components/SwiperCarousel';

// Function to fetch course data from the API
const fetchCourse = async (id) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/courses/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id-${id}:`, error);
        return [];
    }
};

const TestimonialCard = () => {
    return (
        <div className="bg-[#44FFD1] w-full sm:w-3/4 md:w-2/4 h-auto p-6 flex flex-row justify-center items-center gap-10">
            {/* Testimonial Card */}
            <div className="font-bold">
                <h2>Username</h2>
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

const TrainingDetailsPage = () => {
    const { id } = useParams();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [course, setCourse] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCourse(id);
            setCourse(data);
        };
        fetchData();
    }, [id]);

    const [carouselData, setCarouselData] = useState([]);

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const endpoint = `http://localhost:8080/api/courses`;

                const response = await axios.get(endpoint);

                if (response.status === 200) {
                    const result = response.data;
                    let gatheredData = [];

                    if (typeof result === 'object') {
                        gatheredData = result
                            .slice(0, 5)
                            .map((item) => ({ ...item, type: 'courses' }));
                    }
                    setCarouselData(gatheredData);
                } else {
                    console.error('Failed to fetch cards');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCarouselData();
    }, []);
    useEffect(() => {
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
    }, []);

    return (
        <>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="w-full min-h-svh items-center flex flex-col relative top-16 mb-10">
                    <div className="w-full h-full py-12 flex justify-center bg-[url('../assets/img5.png')] items-center flex-col">
                        {/* Main Content Div */}
                        <div className={`w-5/6 aspect-[16/5] flex justify-center items-center rounded-md relative mb-16 ${course.image_url == null ? 'bg-gray-400' : ''}`}>
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
                            <h1 className="font-bold text-2xl mb-4">Title of Training</h1>
                            {course.title ? (
                                <p className="text-center w-full md:w-1/2">{course.title}</p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                Visit{" "}
                                <span
                                    className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                    onClick={() => (window.location.href = course.apply_link)}
                                >
                                    Source
                                </span>{" "}
                                for more information.
                                </p>
                            )}
                            </div>
                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                About The Training
                            </h1> 
                            {course.description ? (
                            <p className="text-center w-full md:w-1/2">
                                {course.description}
                            </p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                Visit{" "}
                                <span
                                    className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                    onClick={() => (window.location.href = course.apply_link)}
                                >
                                    Source
                                </span>{" "}
                                for more information.
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">Type of The Training</h1>
                            {course.label ? (
                                <p className="text-center w-full md:w-1/2">{course.label}</p>
                            ) : (
                                <p className="text-center w-full md:w-1/2">
                                Visit{" "}
                                <span
                                    className="cursor-pointer text-blue-600 underline hover:scale-105 transition-all"
                                    onClick={() => (window.location.href = course.apply_link)}
                                >
                                    Source
                                </span>{" "}
                                for more information.
                                </p>
                            )}
                        </div> 
                    </div>
                    <div className="w-full h-full py-24 flex justify-center items-center flex-col bg-[#4F1ABE] relative">
                    <div
                        className="absolute inset-0 hidden sm:block bg-no-repeat bg-left bg-contain"
                        style={{ backgroundImage: "url('../assets/image6.png')" }}
                    ></div>
                              {course.trainer && course.trainer !== "Unknown" && (
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Instructor</h1>
                            <p>{course.trainer}</p>
                        </div>
                        )}
                        {course.trainer && course.price !== "Unknown" && (
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Price</h1>
                            <p>{course.price}</p>
                        </div>
                        )}
                        {course.location && course.location !== "Unknown" && (
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Location</h1>
                            <p>{course.location}</p>
                        </div>
                        )}
                        {course.duration && course.duration !== "Unknown" && (
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Duration</h1>
                            <p>{course.duration}</p>
                        </div>
                        )}
                        {course.source && course.source !== "Unknown" && (
                        <div className="w-5/6 text-white flex flex-col items-center mb-12">
                            <h1 className="text-3xl font-bold">Organization</h1>
                            <p>{course.source }</p>
                        </div>
                        )}
                        <button
                            className="px-16 py-6 z-10 bg-white text-black font-bold text-xl rounded-lg hover:scale-105 transition-all"
                            onClick={() =>
                                (window.location.href = course.apply_link)
                            }
                        >
                            Apply Here
                        </button>
                    </div>
                    <div className="w-full h-full py-24 bg-[url('../assets/image8.png')] flex justify-center items-center flex-col">
                        {/* Organized By Content Div */}
                        <h1 className="font-bold text-2xl mb-12 -mt-12">
                            Source of this Opportunity
                        </h1>
                        <div className="flex flex-col bg-[#A3A9FE] w-full  md:w-4/6 h-auto p-3  justify-center items-center gap-10">
                            <img
                                src={course.company_logo}
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
                            Testimonials
                        </h1>
                        <div className="h-auto pl-32 pr-32 flex flex-col xl:flex-row justify-between items-center gap-5 mb-16">
                            <TestimonialCard />
                            <TestimonialCard />
                            <TestimonialCard />
                        </div>
                    </div>
                    <div className="w-full h-full py-24 flex justify-center  flex-col bg-[#4F1ABE] bg-[url('../assets/image7.png')] bg-no-repeat text-white">
                        {/* Carousel Div */}
                        <div className="flex flex-col justify-center items-center mb-16">
                            <h1 className="font-bold text-2xl mb-4">
                                Explore similar Trainings
                            </h1>
                            <p className="font-light text-lg">
                                Find your next opportunity
                            </p>
                        </div>
                        <div className="w-full h-full">
                            {/* Carousel */}
                            <SwiperCarousel
                                data={carouselData}
                                favoriteIds={favoriteIds}
                            />
                        </div>
                        <a
                            href="/trainings"
                            className="font-light text-lg pl-96"
                        >
                            ← Go back to all trainings
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SectionWrapper(TrainingDetailsPage);
