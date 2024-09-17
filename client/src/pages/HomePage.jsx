import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import { IoMdArrowDropdown } from 'react-icons/io';
import Card from '../components/Card';
import axios from 'axios';

// Function to fetch course data from the API
const fetchCourses = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/courses');
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
};

const generateFilter = ({ filterList = [], selectedValues, handleChange }) => {
    return filterList.map((type, index) =>
        !type.isPrice ? (
            <div key={index} className="first:mb-8 mb-8 last:mt-8">
                <h1 className="ml-8 text-xl text-white font-bold">
                    {type.title}
                </h1>
                <ul className="text-white text-xl mt-4">
                    {type.items.map((item, index2) => {
                        const isChecked =
                            item.value === selectedValues[item.name];
                        return (
                            <li key={index2} className="py-2 flex items-center">
                                <input
                                    type="radio"
                                    name={item.name}
                                    id={item.id}
                                    value={item.value}
                                    checked={isChecked}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className="relative flex items-center">
                                    <div className="flex items-center justify-center w-5 h-5 mr-3 rounded-full border-2 border-white">
                                        <div
                                            className={`w-5 h-5 rounded-full bg-white transition-opacity duration-200 ease-in-out ${
                                                isChecked
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    </div>
                                    <label
                                        htmlFor={item.id}
                                        className="cursor-pointer select-none border-b border-b-white"
                                    >
                                        {item.display}
                                    </label>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        ) : (
            <div key={index} className="my-8 text-white">
                <h1 className="ml-8 text-xl text-white font-bold">Price</h1>
                <div className="flex flex-row justify-start items-center ml-8 mt-4 text-xl">
                    <p className="mr-4">
                        Min{' '}
                        <IoMdArrowDropdown className="inline hover:cursor-pointer" />
                    </p>
                    <p>
                        Max{' '}
                        <IoMdArrowDropdown className="inline hover:cursor-pointer" />
                    </p>
                </div>
            </div>
        )
    );
};

const SideBar = () => {
    const [selectedValues, setSelectedValues] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return (
        <div className="w-1/3 min-h-96 p-4">
            {generateFilter({
                filterList: [
                    {
                        isPrice: false,
                        title: 'Location',
                        items: [
                            {
                                display: 'Prishtina',
                                name: 'location_radio',
                                id: 'prishtina',
                                value: 'Prishtina',
                            },
                            {
                                display: 'Gjilan',
                                name: 'location_radio',
                                id: 'gjilan',
                                value: 'Gjilan',
                            },
                            {
                                display: 'Prizren',
                                name: 'location_radio',
                                id: 'prizren',
                                value: 'Prizren',
                            },
                        ],
                    },
                    {
                        isPrice: false,
                        title: 'Fields',
                        items: [
                            {
                                display: 'Python',
                                name: 'fields_radio',
                                id: 'python',
                                value: 'Python',
                            },
                            {
                                display: 'Social Media',
                                name: 'fields_radio',
                                id: 'social_media',
                                value: 'Social Media',
                            },
                            {
                                display: 'Digital Marketing',
                                name: 'fields_radio',
                                id: 'digital_marketing',
                                value: 'Digital Marketing',
                            },
                            {
                                display: 'UI/UX',
                                name: 'fields_radio',
                                id: 'ui_ux',
                                value: 'UI/UX',
                            },
                            {
                                display: 'Cyber Security',
                                name: 'fields_radio',
                                id: 'cyber_security',
                                value: 'Cyber Security',
                            },
                        ],
                    },
                    {
                        isPrice: false,
                        title: 'Availability',
                        items: [
                            {
                                display: 'Event Classes',
                                name: 'availability_radio',
                                id: 'event_classes',
                                value: 'Event Classes',
                            },
                            {
                                display: 'Weekend Classes',
                                name: 'availability_radio',
                                id: 'weekend_classes',
                                value: 'Weekend Classes',
                            },
                            {
                                display: 'Flexibile',
                                name: 'availability_radio',
                                id: 'flexibile',
                                value: 'Flexibile',
                            },
                        ],
                    },
                    {
                        isPrice: false,
                        title: 'Duration',
                        items: [
                            {
                                display: 'Workshops',
                                name: 'duration_radio',
                                id: 'workshops',
                                value: 'Workshops',
                            },
                            {
                                display: '3 Months',
                                name: 'duration_radio',
                                id: 'three_months',
                                value: '3 Months',
                            },
                            {
                                display: '6 Months',
                                name: 'duration_radio',
                                id: 'six_months',
                                value: '6 Months',
                            },
                            {
                                display: '1 Year',
                                name: 'duration_radio',
                                id: 'one_year',
                                value: '1 Year',
                            },
                        ],
                    },
                ],
                selectedValues,
                handleChange,
            })}
        </div>
    );
};

const CardsContainer = ({ courses, loadMoreCourses, allCoursesLoaded }) => {
    return (
        <div className="w-2/3 h-min flex justify-center items-center flex-col">
            <div className="w-full h-full grid grid-cols-2 gap-8 justify-items-center">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <Card
                            key={index}
                            id={course.id}
                            card_title={course.title}
                            card_img={course.image_url}
                            card_duration={course.duration}
                            card_description={course.description}
                            card_price={course.price}
                            card_source={course.source}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        No courses available
                    </p>
                )}
            </div>

            {!allCoursesLoaded && courses.length > 0 ? (
                <button
                    onClick={loadMoreCourses}
                    className="mt-12 mb-16 bg-white text-black w-1/3 h-14 rounded-lg font-bold"
                >
                    See More
                </button>
            ) : (
                <div className="mb-32"></div>
            )}
        </div>
    );
};

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [visibleCourses, setVisibleCourses] = useState(6);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCourses();
            setCourses(data);
        };
        fetchData();
    }, []);

    const loadMoreCourses = () => {
        setVisibleCourses((prevVisibleCourses) => prevVisibleCourses + 6);
    };

    const allCoursesLoaded = visibleCourses >= courses.length;

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-[#4F1ABE] relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Trainings</h1>
                    <p className="text-2xl font-light">
                        Pick up your preferences
                    </p>
                </div>
                <div className="flex flex-row justify-center w-5/6 h-auto">
                    <SideBar />
                    <CardsContainer
                        courses={courses.slice(0, visibleCourses)}
                        loadMoreCourses={loadMoreCourses}
                        allCoursesLoaded={allCoursesLoaded}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionWrapper(HomePage);
