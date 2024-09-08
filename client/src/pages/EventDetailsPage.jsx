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
                <h2>Name</h2>
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
                    <IoMdStarHalf className="scale-150 mx-1" />
                    <IoMdStarOutline className="scale-150 ml-1" />
                </div>
            </div>
        </div>
    );
};

const EventDetailsPage = () => {
    const { id } = useParams();

    const [course, setCourse] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCourse(id);
            setCourse(data);
        };
        fetchData();
    }, [id]);

    return (
        <>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="w-full min-h-svh items-center flex flex-col bg-white relative top-16 mb-10">
                    <div className="w-full h-full py-12 flex justify-center items-center flex-col">
                        {/* Main Content Div */}
                        <div className="w-5/6 min-h-96 bg-gray-400 flex justify-center items-center rounded-md relative mb-16">
                            {course.image_url == null ? (
                                <img
                                    src="../assets/no_image.svg"
                                    alt="No Image Available"
                                    className="select-none"
                                />
                            ) : (
                                <div
                                    className="w-full h-full bg-center bg-cover rounded-md select-none"
                                    style={{
                                        backgroundImage: `url(${course.image_url})`,
                                    }}
                                ></div>
                            )}
                        </div>
                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                About The Training
                            </h1>
                            <p className="text-center w-full md:w-1/2">
                                Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit. Enim, veritatis cumque. Vero
                                distinctio asperiores, possimus porro quisquam
                                reiciendis voluptate ea natus fugiat aliquid
                                consequatur obcaecati, pariatur numquam eius
                                tenetur ipsa?
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                Key Responsibilities
                            </h1>
                            <p className="text-center w-full md:w-1/2">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Sint amet qui mollitia
                                temporibus, perspiciatis ex eos doloribus,
                                distinctio recusandae repellat iste error
                                quisquam! Reprehenderit illum ipsa iusto, minima
                                mollitia similique.
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center w-5/6 h-auto mb-12">
                            <h1 className="font-bold text-2xl mb-4">
                                Skills and Experience
                            </h1>
                            <ol className="list-disc text-2xl">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ol>
                        </div>
                    </div>
                    <div className="w-full h-full py-24 flex justify-center items-center flex-col bg-[#4F1ABE]">
                        {/* Secondary Content Div */}
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Skill Level</h1>
                            <p>Example Text</p>
                        </div>
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Age Group</h1>
                            <p>Example Text</p>
                        </div>
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Location</h1>
                            <p>Example Text</p>
                        </div>
                        <div className="w-5/6 text-white flex flex-col items-center mb-6">
                            <h1 className="text-3xl font-bold">Duration</h1>
                            <p>{course.duration ? course.duration : 'N/A'}</p>
                        </div>
                        <div className="w-5/6 text-white flex flex-col items-center mb-12">
                            <h1 className="text-3xl font-bold">Organization</h1>
                            <p>{course.source ? course.source : 'No Source'}</p>
                        </div>
                        <button className="px-16 py-6 bg-white text-black font-bold text-xl rounded-lg hover:scale-105 transition-all">
                            Apply Here
                        </button>
                    </div>
                    <div className="w-full h-full py-24 flex justify-center items-center flex-col">
                        {/* Organized By Content Div */}
                        <h1 className="font-bold text-2xl mb-24">
                            Organized by
                        </h1>
                        <div className="flex flex-col bg-[#A3A9FE] w-full h-auto justify-center items-center">
                            <div className="w-5/6 justify-center items-center flex flex-col py-12">
                                <h3 className="text-white">
                                    {course.source
                                        ? course.source
                                        : 'No Source'}
                                </h3>
                                <div className="flex flex-col mt-10">
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        Contact
                                    </button>
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        Follow
                                    </button>
                                    <button className="py-2 px-16 bg-white rounded-md my-4 hover:scale-[1.02] transition-all">
                                        Phone Number
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-full py-12 flex justify-center items-center flex-col">
                        {/* Testimonials Content Div */}
                        <h1 className="font-bold text-2xl mb-24">
                            Testimonials
                        </h1>
                        <div className="w-5/6 h-auto flex flex-col xl:flex-row justify-between items-center gap-5 mb-16">
                            <TestimonialCard />
                            <TestimonialCard />
                            <TestimonialCard />
                        </div>
                    </div>
                    <div className="w-full h-full py-24 flex justify-center items-center flex-col bg-[#4F1ABE] text-white">
                        {/* Carousel Div */}
                        <div className="flex flex-col justify-center items-center mb-16">
                            <h1 className="font-bold text-2xl mb-4">
                                Explore similar trainings
                            </h1>
                            <p className="font-light text-lg">
                                Find your next oppertunity
                            </p>
                        </div>
                        <div className="w-full h-full">
                            {/* Carousel */}
                            <SwiperCarousel />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SectionWrapper(EventDetailsPage);