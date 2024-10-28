import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import axios from 'axios';

// Function to fetch event data from the API
const fetchEvents = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/events');
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

const CardsContainer = ({
    events,
    loadMoreEvents,
    allEventsLoaded,
    isFilterOpen,
}) => {
    return (
        <div
            className={`flex justify-center items-center flex-col ${
                isFilterOpen ? 'col-start-1 sm:col-start-2' : 'col-start-1'
            } col-end-5`}
        >
            <div
                className={`w-full h-full grid grid-cols-1 md:grid-cols-2 ${
                    isFilterOpen ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-y-8 justify-items-center`}
            >
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <Card
                            key={index}
                            id={event.id}
                            card_title={event.title}
                            card_img={event.image_url}
                            card_duration={event.duration}
                            card_description={event.description}
                            card_price={event.price}
                            card_source={event.source}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">
                        No events available
                    </p>
                )}
            </div>

            {!allEventsLoaded && events.length > 0 ? (
                <button
                    onClick={loadMoreEvents}
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

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [visibleEvents, setVisibleEvents] = useState(6);
    const [selectedValues, setSelectedValues] = useState({
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchEvents();
            setEvents(data);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSearch = () => {
        console.log('Search clicked', selectedValues);
    };

    const loadMoreEvents = () => {
        setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 6);
    };

    const allEventsLoaded = visibleEvents >= events.length;

    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const handleFilterToggle = (val) => {
        setIsFilterOpen(!val);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-[url('../assets/background.png')]  bg-no-repeat relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">Events</h1>
                    <p className="text-2xl font-light">
                        Pick up your preferences
                    </p>
                </div>
                {/* <div className="flex flex-row justify-between w-5/6 h-auto"> */}
                <div className="grid grid-cols-4 w-5/6 h-auto">
                    <Filter
                        filterList={[
                            {
                                isPrice: false,
                                title: 'Event type',
                                items: [
                                    {
                                        display: 'Arts and Culture',
                                        name: 'type_radio',
                                        id: 'Arts_and_Culture',
                                        value: 'Arts and Culture',
                                    },
                                    {
                                        display: 'Business',
                                        name: 'type_radio',
                                        id: 'Business',
                                        value: 'Business',
                                    },
                                    {
                                        display: 'Education',
                                        name: 'type_radio',
                                        id: 'Education',
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
                            // Price Filter Section
                            {
                                isPrice: true,
                                title: 'Price',
                                items: [
                                    {
                                        display: (
                                            <div className="flex justify-between">
                                                <input
                                                    type="number"
                                                    name="minPrice"
                                                    placeholder="Min"
                                                    value={
                                                        selectedValues.minPrice
                                                    }
                                                    onChange={handleChange}
                                                    className="border border-gray-400 rounded-md p-1 w-20 text-black"
                                                />
                                                <input
                                                    type="number"
                                                    name="maxPrice"
                                                    placeholder="Max"
                                                    value={
                                                        selectedValues.maxPrice
                                                    }
                                                    onChange={handleChange}
                                                    className="border border-gray-400 rounded-md p-1 w-20 text-black"
                                                />
                                            </div>
                                        ),
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Special Features',
                                items: [
                                    {
                                        display: 'Virtual Events',
                                        name: 'Special_radio',
                                        id: 'Virtual_events',
                                        value: 'Virtual Events',
                                    },
                                    {
                                        display: 'Outdoor Events',
                                        name: 'Special_radio',
                                        id: 'Outdoor_Events',
                                        value: 'Outdoor Events',
                                    },
                                    {
                                        display: 'Indoor Events',
                                        name: 'Special_radio',
                                        id: 'indoor_Events',
                                        value: 'Indoor Events',
                                    },
                                ],
                            },
                            {
                                isPrice: false,
                                title: 'Duration',
                                items: [
                                    {
                                        display: 'Short(1-2)hours',
                                        name: 'duration_radio',
                                        id: 'Short',
                                        value: 'Short(1-2)hours',
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
                                        id: 'Full_day',
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
                        ]}
                        selectedValues={selectedValues}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleFilterToggle={handleFilterToggle}
                    />
                    <CardsContainer
                        events={events.slice(0, visibleEvents)}
                        loadMoreEvents={loadMoreEvents}
                        allEventsLoaded={allEventsLoaded}
                        isFilterOpen={isFilterOpen}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionWrapper(EventsPage);
