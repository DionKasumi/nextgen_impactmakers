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
    const [selectedValues, setSelectedValues] = useState({
        minPrice: '',
        maxPrice: ''
    });

    const handleChange = (Internship) => {
        const { name, value } = Internship.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        console.log("Search clicked", selectedValues);
    };

    return (
        <div className="w-1/4 min-h-96 p-4 hidden lg:flex flex-col">
            <div className="border-r border-gray-300 pr-4">
                {generateFilter({
                    filterList: [
                        {
                            isPrice: false,
                            title: 'Internship type',
                            items: [
                                {
                                    display: 'Graphic Design',
                                    name: 'Internship_radio',
                                    id: 'graphic_design',
                                    value: 'Graphic Design',
                                },
                                {
                                    display: 'Programming',
                                    name: 'Internship_radio',
                                    id: 'Programing',
                                    value: 'Programming',
                                },
                                {
                                    display: 'Social Media Manager',
                                    name: 'Internship_radio',
                                    id: 'social_media',
                                    value: 'Social Media Manager',
                                },
                                {
                                    display: 'Medicine',
                                    name: 'Medicine_radio',
                                    id: 'Medicine',
                                    value: 'Medicine',
                                },
                            ],
                        },
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
                            title: 'Special Features',
                            items: [
                                {
                                    display: 'Remote',
                                    name: 'Special_radio',
                                    id: 'remote',
                                    value: 'Remote',
                                },
                                {
                                    display: 'In office',
                                    name: 'Special_radio',
                                    id: 'in_office',
                                    value: 'In office',
                                },
                                {
                                    display: 'Hybrid',
                                    name: 'Special_radio',
                                    id: 'hybrid',
                                    value: 'Hybrid',
                                },
                            ],
                        },
                        {
                            isPrice: false,
                            title: 'Type',
                            items: [
                                {
                                    display: 'Part-time',
                                    name: 'type_radio',
                                    id: 'part_time',
                                    value: 'Part Time',
                                },
                                {
                                    display: 'Full time',
                                    name: 'type_radio',
                                    id: 'Full_time',
                                    value: 'Full Time',
                                },
                            ],
                        },
                        {
                            isPrice: false,
                            title: 'Level of Studies',
                            items: [
                                {
                                    display: 'High School',
                                    name: 'duration_radio',
                                    id: 'High_School',
                                    value: 'High School',
                                },
                                {
                                    display: 'Undergraduate',
                                    name: 'duration_radio',
                                    id: 'Undergraduate',
                                    value: 'Undergraduate',
                                },
                                {
                                    display: 'Bachelor Degree',
                                    name: 'duration_radio',
                                    id: 'Bachelor_Degree',
                                    value: 'Bachelor Degree',
                                },
                                {
                                    display: 'Master Degree',
                                    name: 'duration_radio',
                                    id: 'Master_Degree',
                                    value: 'Master Degree',
                                },
                            ],
                        },
                        {
                            isPrice: false,
                            title: 'level',
                            items: [
                                {
                                    display: '3 Months',
                                    name: 'level_radio',
                                    id: 'three_months',
                                    value: '3 Months',
                                },
                                {
                                    display: '4 Months',
                                    name: 'level_radio',
                                    id: 'four_months',
                                    value: '4 Months',
                                },
                                {
                                    display: '6 Months',
                                    name: 'level_radio',
                                    id: 'six_months',
                                    value: '6 Months',
                                },
                            ],
                        },
                    ],
                    selectedValues,
                    handleChange,
                })}
            </div>

            {/* Search Button outside the vertical line */}
            <button
                className="mt-10 bg-white text-indigo-700 font-semibold py-3 px-4 rounded hover:bg-blue-200"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
};


const CardsContainer = ({ courses, loadMoreCourses, allCoursesLoaded }) => {
    return (
        <div className="w-4/4 lg:w-3/4 h-min flex justify-center items-center flex-col">
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
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
                    className="my-12 bg-white text-black w-2/3 lg:w-1/3 h-14 rounded-lg font-bold"
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
            <div className="w-full min-h-svh items-center flex flex-col bg-[url('../assets/background.png')]  bg-no-repeat relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Internships</h1>
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
