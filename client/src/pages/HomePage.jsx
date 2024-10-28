import SectionWrapper from '../hoc/SectionWrapper';
import SwiperCarousel from '../components/SwiperCarousel';
import { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';

const FirstPart = () => {
    return (
        <div className="w-full h-full pt-40 flex flex-col justify-center items-center bg-[url('../assets/back1.png')] bg-no-repeat bg-cover">
            <div className="w-full min-h-svh items-center flex flex-col relative top-[20%]  ">
                <div className="flex flex-row ">
                    <img
                        src="../assets/Group 703.png"
                        alt="Decorative Image"
                        className="w-25 h-20 mb-10 object-cover opacity-100"
                    />
                    <h1 className="text-4xl text-white mb-8 ml-24 mr-40 font-bold  ">
                        Opportunities in One!
                    </h1>
                </div>
                <div className="mb-20">
                    <select
                        className="mr-5 border border-gray-300 rounded px-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="select-category"
                        id="select-category"
                    >
                        <option value="" disabled selected>
                            Select category
                        </option>
                        <option value="1">Events</option>
                        <option value="2">Internships</option>
                        <option value="3">Volunteering</option>
                        <option value="4">Trainings</option>
                    </select>
                    <button
                        type="submit"
                        class="py-2 px-20 bg-[#44FFD1] text-black font-semibold  rounded-10px"
                    >
                        Search
                    </button>
                </div>
                <SwiperCarousel />
            </div>
            <div className="absolute bottom-0 right-0 m-5">
                <img
                    src="../assets/image 1.png"
                    alt="chatbot"
                    className="w-25 h-25 object-cover "
                />
            </div>
        </div>
    );
};


const SecondPart = () => {
    return (
        <div className="bg-[#4F1ABE] text-white py-16 md:py-32 min-h-[500px] w-full">
            <div className="container mx-auto text-center px-4 md:px-0">
                <h2 className="text-3xl md:text-[48px] font-bold mb-6 md:mb-16">
                    About PYE
                </h2>
                <p className="text-base md:text-lg max-w-lg mx-auto ">
                    A platform aimed at providing a trustworthy source of all
                    Events, trainings, internships, and volunteering
                    opportunities in Kosova
                </p>
            </div>
        </div>
    );
};

const ThirdPart = () => {
    return (
        <div className="relative w-full h-auto  py-10">
            <img
                src="../assets/image 4.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />

            <div className="relative flex flex-col items-center justify-center h-full bg-white bg-opacity-0 py-16 px-4 sm:px-8">
                <h2 className="text-center text-3xl sm:text-4xl font-bold mb-10 sm:mb-16">
                    Our Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-12 max-w-4xl mx-auto">
                    <a href="/internships">
                        <div className="relative flex flex-col items-center group">
                            <img
                                src="../assets/Group 769.png"
                                alt="internships"
                                className="w-full h-48 sm:h-[300px] lg:h-[350px] object-cover rounded-lg transition-transform duration-300 ease-in-out"
                            />
                            <img
                                src="../assets/image 9.png"
                                alt="internships Hover"
                                className="absolute top-0 left-0 w-full h-48 sm:h-[300px] lg:h-[350px] rounded-lg object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </a>

                    <a href="/trainings">
                        <div className="relative flex flex-col items-center group">
                            <img
                                src="../assets/Group 770.png"
                                alt="trainings"
                                className="w-full h-48 sm:h-[300px] lg:h-[350px] object-cover rounded-lg transition-transform duration-300 ease-in-out"
                            />
                            <img
                                src="../assets/image 9.png"
                                alt="trainings Hover"
                                className="absolute top-0 left-0 w-full h-48 sm:h-[300px] lg:h-[350px] rounded-lg object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </a>

                    <a href="/volunteering">
                        <div className="relative flex flex-col items-center group">
                            <img
                                src="../assets/Group 771.png"
                                alt="volunteering"
                                className="w-full h-48 sm:h-[300px] lg:h-[350px] object-cover rounded-lg transition-transform duration-300 ease-in-out"
                            />
                            <img
                                src="../assets/image 9.png"
                                alt="volunteering Hover"
                                className="absolute top-0 left-0 w-full h-48 sm:h-[300px] lg:h-[350px] rounded-lg object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </a>

                    <a href="/events">
                        <div className="relative flex flex-col items-center group">
                            <img
                                src="../assets/Group 772.png"
                                alt="events"
                                className="w-full h-48 sm:h-[300px] lg:h-[350px] object-cover rounded-lg transition-transform duration-300 ease-in-out"
                            />
                            <img
                                src="../assets/image 9.png"
                                alt="events Hover"
                                className="absolute top-0 left-0 w-full h-48 sm:h-[300px] lg:h-[350px] rounded-lg object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

const FourthPart = () => {
    const [startCounter, setStartCounter] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setStartCounter(true); // Start counter when in view
                } else {
                    setStartCounter(false);
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => {
            if (counterRef.current) {
                observer.unobserve(counterRef.current);
            }
        };
    }, []);

    return (
        <div ref={counterRef} className="relative w-full h-full">
            <img
                src="../assets/back2.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover opacity-90 py-30"
            />

            <div className="relative flex flex-col items-center justify-center h-full bg-white bg-opacity-0 py-20">
                <h1 className="text-4xl text-white text-center mb-10 font-bold">
                    Registered
                </h1>

                <h2 className="text-[32px] text-white mb-20 font-poppins font-light opacity-100">
                    Users and Organizations
                </h2>

                <div className="flex flex-nowrap justify-center mt-10 gap-80 max-w-2xl mx-auto text-center overflow-x-auto">
                    <div className=" text-white flex flex-col items-center italic">
                        <img
                            src="../assets/Group 745.png"
                            alt="Individuals"
                            className="w-[120px] h-[120px] mb-2"
                        />
                        <h1 className="text-4xl text-[#6bf1c6] text-center mt-10 mb-10 font-bold">
                            {startCounter ? (
                                <CountUp end={50000} duration={2} />
                            ) : (
                                '0'
                            )}{' '}
                            {/* Counter for Individuals */}
                        </h1>
                        <p className="text-xl">Individuals</p>
                    </div>

                    <div className="text-white flex flex-col items-center italic">
                        <img
                            src="../assets/Group 718.png"
                            alt="Organizations"
                            className="w-[120px] h-[120px] mb-2"
                        />
                        <h1 className="text-4xl text-[#6bf1c6] text-center mt-10 mb-10 font-bold">
                            {startCounter ? (
                                <CountUp end={50001} duration={2} />
                            ) : (
                                '0'
                            )}{' '}
                            {/* Counter for Organizations */}
                        </h1>
                        <p className="text-xl">Organizations</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const FivethPart = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[url('../assets/group1.png')] px-4 lg:px-0 bg-no-repeat bg-cover">
            <div>
                <h1 className="text-2xl md:text-4xl text-white text-center p-10 md:mb-10 font-bold">
                    Upcoming Opportunities
                </h1>
                <h2 className="text-lg md:text-2xl text-white text-center mb-10 font-light">
                    Find your next opportunity
                </h2>
            </div>
            <SwiperCarousel />
        </div>
    );
};

const SixthPart = () => {
    return (
        <div className="relative w-full min-h-[500px] overflow-hidden px-4">
            <img
                src="../assets/Group 749.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center text-2xl md:text-3xl font-light z-10">
                    Never stop growing with PYE!
                </div>
            </div>
        </div>
    );
};

const SeventhPart = () => {
    // State to manage the order of the cards
    const [selectedCard, setSelectedCard] = useState('yellow');

    return (
        <div className="w-full h-full flex flex-col bg-[url('../assets/background3.png')] justify-center items-center py-20">
            <div className="text-white text-5xl font-bold mb-48">Reviews</div>

            <div className="relative w-full flex justify-center items-center -space-x-80">
                <div
                    onClick={() => setSelectedCard('teal')}
                    className={`relative flex flex-col justify-center items-center rounded-xl bg-[#4FEAC6] w-[44rem] h-56 p-6 shadow-lg transition-transform duration-500 ease-in-out 
            ${
                selectedCard === 'teal'
                    ? 'z-50 mb-44 scale-110 relative left-96'
                    : 'z-10  scale-100'
            }
        `}
                >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                    <h1 className="text-lg mb-8 self-start">Username</h1>
                    <div className="text-sm md:text-base text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi{' '}
                    </div>
                </div>

                <div
                    onClick={() => setSelectedCard('yellow')}
                    className={`relative flex flex-col justify-center items-center rounded-xl bg-[#F6F49D] w-[44rem] h-56 p-6 shadow-lg transition-transform duration-500 ease-in-out 
            ${
                selectedCard === 'yellow'
                    ? 'z-50 mb-44 scale-110'
                    : 'relative right-96  z-20 scale-100'
            }
            `}
                >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                    <h1 className="text-lg mb-8 self-start">Username</h1>
                    <div className="text-sm md:text-base text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi
                    </div>
                </div>

                <div
                    onClick={() => setSelectedCard('lavender')}
                    className={`relative flex flex-col justify-center items-center rounded-xl bg-[#B3B5FF] w-[44rem] h-56 p-6 shadow-lg transition-transform duration-500 ease-in-out 
            ${
                selectedCard === 'lavender'
                    ? 'z-50 mb-44 relative right-80 scale-110'
                    : 'z-30 scale-100'
            }
        `}
                >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                    <h1 className="text-lg mb-8 self-start">Username</h1>
                    <div className="text-sm md:text-base text-black">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <FirstPart />
            <SecondPart />
            <ThirdPart />
            <FourthPart />
            <FivethPart />
            <SixthPart />
            <SeventhPart />
        </div>
    );
};

export default SectionWrapper(HomePage);
