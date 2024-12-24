import { useState } from 'react';
import {
    IoMdArrowDropdown,
    IoMdArrowDropleft,
    IoMdArrowDropright,
} from 'react-icons/io';

const generateFilter = ({ filterList = [], selectedValues, handleChange }) => {
    return filterList.map((type, index) => {
        const inputType = type.inputType || 'radio'; // Default to radio if not specified

        return !type.isPrice ? (
            <div key={index} className="first:mb-8 mb-8 last:mt-8 last:mb-0">
                <h1 className="ml-8 text-xl text-white font-bold">
                    {type.title}
                </h1>
                <ul className="text-white text-xl mt-4">
                    {type.items.map((item, index2) => {
                        let isChecked = false;
                        if (inputType === 'checkbox') {
                            isChecked = (selectedValues[item.name] || []).includes(item.value);
                        } else {
                            isChecked = item.value === selectedValues[item.name];
                        }
                        return (
                            <li key={index2} className="py-2 flex items-center">
                                <input
                                    type={inputType}
                                    name={item.name}
                                    id={item.id}
                                    value={item.value}
                                    checked={isChecked}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className="relative flex items-center">
                                    <div className="flex items-center justify-center w-5 h-5 mr-3 rounded-full border-2 border-white">
                                        {inputType === 'checkbox' ? (
                                            <div
                                                className={`w-3 h-3 rounded-full bg-white transition-opacity duration-200 ease-in-out ${
                                                    isChecked ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            />
                                        ) : (
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white transition-opacity duration-200 ease-in-out ${
                                                    isChecked ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            />
                                        )}
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
        );
    });
};

const Filter = ({
    filterList,
    selectedValues,
    handleChange,
    handleSearch,
    handleResetFilters,
    handleFilterToggle,
}) => {
    const [filterOpen, setFilterOpen] = useState(true);
    const toggleFilter = () => {
        setFilterOpen((prev) => !prev);
        handleFilterToggle(filterOpen);
    };

    return (
        <div className={`flex flex-col col-start-1 col-end-5 sm:col-end-2`}>
            <div
                className={`${
                    filterOpen ? 'w-full' : 'w-dvh'
                } h-12 text-white flex flex-row justify-between items-center mb-6`}
            >
                <button
                    type="button"
                    onClick={toggleFilter}
                    className="flex flex-row justify-center items-center bg-[#5018A2C7] rounded-md px-3 py-2 gap-4 mr-2 hover:scale-105 transition-transform"
                >
                    <img
                        className="w-1/4"
                        src="/assets/filter_img.svg"
                        alt=""
                    />
                    Filters
                </button>
                {filterOpen ? (
                    <IoMdArrowDropleft className="scale-[2]" />
                ) : (
                    <IoMdArrowDropright className="scale-[2]" />
                )}
            </div>
            <div
                className={`sm:border-r sm:border-gray-300 pr-4 ${
                    filterOpen ? '' : 'hidden'
                }`}
            >
                {generateFilter({ filterList, selectedValues, handleChange })}
            </div>
            {filterOpen && (
                <div className="mt-10 mb-16 flex ">
                    <button
                        className="bg-white text-indigo-700 font-semibold py-3 px-4 rounded hover:bg-blue-200 w-1/2 mr-4"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <button
                        className="bg-white text-indigo-700 font-semibold py-3 px-4 rounded hover:bg-blue-200 w-1/2"
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Filter;
