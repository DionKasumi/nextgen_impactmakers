/* eslint-disable react-refresh/only-export-components */

import SectionWrapper from '../hoc/SectionWrapper';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import Card from '../components/Card';
import Footer from '../components/Footer';

const generateFilter = ({ filterList = [] }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedValues, setSelectedValues] = useState({}); // Use an object to store selected values for each category

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return filterList.map((type, index) =>
        !type.isPrice ? (
            <div key={index} className="first:mb-8 last:mt-8">
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
    return (
        <div className="w-1/3 min-h-96 p-4">
            {generateFilter({
                filterList: [
                    {
                        isPrice: false,
                        title: 'Event Type',
                        items: [
                            {
                                display: 'Arts and Culture',
                                name: 'event_type_radio',
                                id: 'arts_and_culture',
                                value: 'Arts and Culture',
                            },
                            {
                                display: 'Bussiness',
                                name: 'event_type_radio',
                                id: 'bussiness',
                                value: 'Bussiness',
                            },
                            {
                                display: 'Education',
                                name: 'event_type_radio',
                                id: 'education',
                                value: 'Education',
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
                        isPrice: true,
                    },
                    {
                        isPrice: false,
                        title: 'Special Features',
                        items: [
                            {
                                display: 'Virtual Events',
                                name: 'special_features_radio',
                                id: 'virtual_events',
                                value: 'Virtual Events',
                            },
                            {
                                display: 'Outdoor Events',
                                name: 'special_features_radio',
                                id: 'outdoor_events',
                                value: 'Outdoor Events',
                            },
                            {
                                display: 'Indoor Events',
                                name: 'special_features_radio',
                                id: 'indoor_events',
                                value: 'Indoor Events',
                            },
                        ],
                    },
                    {
                        isPrice: false,
                        title: 'Duration',
                        items: [
                            {
                                display: 'Short (1-2 hours)',
                                name: 'duration_radio',
                                id: 'short',
                                value: 'Short',
                            },
                            {
                                display: 'Half Day',
                                name: 'duration_radio',
                                id: 'half_day',
                                value: 'Half Day',
                            },
                            {
                                display: 'Full Day',
                                name: 'duration_radio',
                                id: 'full_day',
                                value: 'Full Day',
                            },
                            {
                                display: 'Multi Days',
                                name: 'duration_radio',
                                id: 'multi_days',
                                value: 'Multi Days',
                            },
                        ],
                    },
                ],
            })}
        </div>
    );
};

const generateCards = (amount) => {
    return (
        <div className="w-full h-full grid grid-cols-2 gap-8 justify-items-center">
            {Array(amount)
                .fill(0)
                .map((_, index) => {
                    return (
                        <Card
                            card_title={'Card ' + index}
                            card_price={'€99.99'}
                            card_description={
                                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt hic.'
                            }
                            card_duration={'01 Jan 2021 - 01 Jan 2025'}
                            key={index}
                        />
                    );
                })}
        </div>
    );
};

const CardsContainer = () => {
    return (
        <div className="w-2/3 h-min flex justify-center items-center flex-col">
            {generateCards(8)}
            <button className="mt-12 mb-32 bg-white text-black w-1/3 h-14 rounded-lg font-bold">
                See More
            </button>
        </div>
    );
};

const HomePage = () => {
    return (
        <div className="flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-[#4F1ABE] relative top-10 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Events</h1>
                    <p className="text-2xl font-light">
                        Filter your preferences
                    </p>
                </div>
                <div className="flex flex-row justify-center w-5/6 h-auto">
                    <SideBar />
                    <CardsContainer />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SectionWrapper(HomePage);
