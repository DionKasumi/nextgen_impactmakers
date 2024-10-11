import SectionWrapper from '../hoc/SectionWrapper';
import SwiperCarousel from '../components/SwiperCarousel';

const FirstPart = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
            <div className="w-full min-h-svh items-center flex flex-col bg-[#4F1ABE] relative top-[20%] mb-20 ">
                <div className="flex flex-row ">
                    <img
                        src="../assets/Group 703.png"
                        className="w-40 h-20 mb-5 -mr-10"
                    />
                    <h1 className="text-4xl text-white mb-8 ml-24 mr-64 font-bold  ">
                        Opportunities In One!
                    </h1>
                </div>
                <div className="">
                    <select
                        className="mr-5 border border-gray-300 rounded px-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="select-category"
                        id="select-category"
                    >
                        <option value="" disabled selected>
                            Select category
                        </option>
                        <option value="1">val 1</option>
                        <option value="2">val 2</option>
                        <option value="3">val 3</option>
                        <option value="4">val 4</option>
                        <option value="5">val 5</option>
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
        </div>
    );
};

const SecondPart = () => {
    return (
        <div className="relative w-full h-screen ">
            <img
                src="../assets/Group 749.png"
                alt="Background Decorative Image"
                className="absolute inset-36 w-full h-full object-cover"
            />

            <div className="relative flex flex-col items-center justify-center h-full bg-white bg-opacity-0 py-16">
                <h2 className="text-center text-4xl font-bold mb-16">
                    Our Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center">
                        <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg mb-4">
                            Volunteering
                        </button>
                        <p className="text-center text-gray-600 px-6">
                            Lorem ipsum dolor sit amet consectetur. Auctor
                            vivamus sed at mauris id. Ornare tortor dis
                            vestibulum ac nibh.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg mb-4">
                            Trainings
                        </button>
                        <p className="text-center text-gray-600 px-6">
                            Lorem ipsum dolor sit amet consectetur. Auctor
                            vivamus sed at mauris id. Ornare tortor dis
                            vestibulum ac nibh.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg mb-4">
                            Internships
                        </button>
                        <p className="text-center text-gray-600 px-6">
                            Lorem ipsum dolor sit amet consectetur. Auctor
                            vivamus sed at mauris id. Ornare tortor dis
                            vestibulum ac nibh.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg mb-4">
                            Events
                        </button>
                        <p className="text-center text-gray-600 px-6">
                            Lorem ipsum dolor sit amet consectetur. Auctor
                            vivamus sed at mauris id. Ornare tortor dis
                            vestibulum ac nibh.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThirdPart = () => {
    return (
        <div className="bg-[#4F1ABE] text-white py-32 min-h-[500px] w-full relative overflow-hidden">
            <div className="container mx-auto text-center">
                <h2 className="text-[48px] font-bold mb-16">About PYE</h2>

                <div className="w-40 h-0.5 mx-auto bg-white mb-16"></div>

                <p className="text-[18px] max-w-lg mx-auto">
                    Lorem ipsum dolor sit amet consectetur. Duis odio massa
                    viverra non viverra congue ut. Convallis ultrices orci
                    euismod neque sit interdum. Cras laoreet sed elementum massa
                    nulla neque. Sed elementum massa.
                </p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-48 border border-white rounded-full transform translate-x-12 translate-y-12"></div>
        </div>
    );
};

const FourthPart = () => {
    return (
        <div className="relative w-full h-screen bg-[url('./untitled.svg')] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center">
            <img
                src="../assets/Group 749.png"
                alt="Background Decorative Image"
                className="absolute inset-0 w-full h-full object-cover opacity-50" // Adjust opacity as needed
            />

            <div className="relative flex flex-col items-center justify-center h-full bg-white bg-opacity-0 py-16">
                {/* Title */}
                <h2 className="text-center text-4xl font-bold mb-48">
                    Registered
                </h2>

                <div className="flex flex-nowrap justify-center gap-28 max-w-5xl mx-auto text-center overflow-x-auto">
                    <div className="flex flex-col items-center italic ">
                        <img
                            src="../assets/Group 715.png"
                            alt="Students"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Students</p>
                    </div>

                    <div className="flex flex-col items-center italic ">
                        <img
                            src="../assets/Group 716.png"
                            alt="Individuals"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Individuals</p>
                    </div>

                    <div className="flex flex-col items-center italic ">
                        <img
                            src="../assets/Group 745.png"
                            alt="Organizations"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Organizations</p>
                    </div>

                    <div className="flex flex-col items-center italic ">
                        <img
                            src="../assets/Group 714.png"
                            alt="Companies"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Companies</p>
                    </div>

                    <div className="flex flex-col items-center italic ">
                        <img
                            src="../assets/Group 718.png"
                            alt="Communities"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Communities</p>
                    </div>

                    <div className="flex flex-col items-center text-lg  italic">
                        <img
                            src="../assets/Group 715.png"
                            alt="Educational Institutions"
                            className="w-[80px] h-[80px] mb-2" // Uniform size for all images
                        />
                        <p className="text-sm">Educational Institutions</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FivethPart = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-[#4F1ABE]">
            <div className="w-full min-h-svh items-center flex flex-col bg-[#4F1ABE] relative top-[20%] mb-20 ">
                <div className=" ">
                    <h1 className="text-4xl text-white text-center mb-10 font-bold  ">
                        Upcoming Opportunities
                    </h1>

                    <h2 className="text-[24px] text-white text-center mb-10 font-poppins font-light opacity-100">
                        Find your next opportunity{' '}
                    </h2>
                </div>
                <div className=""></div>
                <SwiperCarousel />
            </div>
        </div>
    );
};


const SixthPart = () => {
    return (
        <div className="relative w-full h-[50vh] bg-cover bg-no-repeat bg-center flex flex-col items-center justify-center">
            <img
                src="../assets/Group 749.png"
                alt="Background Decorative Image"
                className="absolute inset-36 w-full h-full object-cover opacity-50"
            />
            <div className="relative flex flex-col items-center justify-center h-full bg-white bg-opacity-0 py-16"></div>

            <div class="pt-[5rem] pb-[5rem] bg-[url('./untitled.svg')] bg-cover bg-no-repeat bg-center">
                <div class="text-center">
                    <div class="text-3xl font-popins font-light mb-4">
                        Never stop growing with PYE!
                    </div>
                </div>
            </div>
        </div>
    );
};


const SeventhPart = () => {
    return (
        <div class="py-16 bg-[#4F1ABE] text-white w-full h-full mt-48">
            <div class="flex flex-col justify-center items-center py-20">
                <div class="text-white text-5xl font-bold mb-48">Reviews</div>

                <div class="relative w-full flex justify-center items-center -space-x-80">
                    <div class="relative flex justify-center items-center rounded-xl bg-[#4FEAC6] w-[44rem] h-56 p-6 shadow-lg z-10">
                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                        <div class="text-sm md:text-base text-black">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </div>
                    </div>

                    <div class="relative flex justify-center items-center rounded-xl bg-[#F6F49D] w-[44rem] h-56 p-6 shadow-lg z-50 mb-44">
                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                        <div class="text-sm md:text-base text-black">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi.
                        </div>
                    </div>

                    <div class="relative flex justify-center items-center rounded-xl bg-[#B3B5FF] w-[44rem] h-56 p-6 shadow-lg z-10">
                        <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-white border-2 border-[#F6F49D]"></div>
                        <div class="text-sm md:text-base text-black">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HomePage = () => {
    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
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
