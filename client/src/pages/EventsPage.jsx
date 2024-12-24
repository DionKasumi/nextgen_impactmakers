import { useState, useEffect } from 'react';
import SectionWrapper from '../hoc/SectionWrapper';
import Card from '../components/Card';
import Filter from '../components/Filter';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const fetchEvents = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/events');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

const fetchEventLabels = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/events/labels');
        let labels = response.data;

        // Filter out "Other" from the labels array
        labels = labels.filter(label => label !== "Other");

        console.log("Event labels fetched without 'Other':", labels);
        return labels;
    } catch (error) {
        console.error('Error fetching event labels:', error);
        return [];
    }
};

const fetchFavorites = async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/api/favorites',
            {
                withCredentials: true,
            }
        );

        return (response.data || []).map(
            (fav) => `${fav.card_id}-${fav.card_type}`
        );
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

const CardsContainer = ({
    events,
    loadMoreEvents,
    allEventsLoaded,
    isFilterOpen,
    favoriteIds,
    toggleFavorite,
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
                {events.length > 0
                    ? events.map((event, index) => (
                          <Card
                              key={index}
                              id={event.id}
                              card_title={event.title}
                              card_img={event.image_url}
                              card_duration={event.duration}
                              card_description={event.description}
                              card_price={event.price}
                              card_source={event.source}
                              card_type="events"
                              isFavorite={favoriteIds.includes(
                                  `${event.id}-events`
                              )}
                              onToggleFavorite={() =>
                                  toggleFavorite(event.id, 'events')
                              }
                          />
                      ))
                    : Array(6)
                          .fill(null)
                          .map((_, index) => (
                              <SkeletonCard key={index} isSwiperCard={false} />
                          ))}
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
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [labels, setLabels] = useState([]);
    const [visibleEvents, setVisibleEvents] = useState(6);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const eventsData = await fetchEvents();
            setEvents(eventsData.data);
            setFilteredEvents(eventsData.data);

            const labelsData = await fetchEventLabels();
            setLabels(labelsData);

            const favoritesData = await fetchFavorites();
            setFavoriteIds(favoritesData);
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === 'Events_checkbox') {
            setSelectedFilters((prevFilters) => {
                if (checked) return [...prevFilters, value];
                return prevFilters.filter((filter) => filter !== value);
            });
        }
    };

    const handleSearch = async () => {
        try {
            if (selectedFilters.length === 0) {
                setFilteredEvents(events);
            } else {
                const response = await axios.get('http://localhost:8080/api/events/filtered', {
                    params: { labels: selectedFilters.join(',') },
                });
                setFilteredEvents(Array.isArray(response.data) ? response.data : []);
            }
            setVisibleEvents(6);
        } catch (error) {
            console.error('Error fetching filtered events:', error);
        }
    };

    const handleResetFilters = () => {
        setSelectedFilters([]);
        setFilteredEvents(events);
        setVisibleEvents(6);
    };

    const loadMoreEvents = () => {
        setVisibleEvents((prev) => prev + 6);
    };

    const allEventsLoaded = visibleEvents >= filteredEvents.length;

    const toggleFavorite = async (id, type) => {
        try {
            const isFavorite = favoriteIds.includes(`${id}-${type}`);
            const method = isFavorite ? 'DELETE' : 'POST';

            await axios({
                method,
                url: `http://localhost:8080/api/favorites/${
                    method === 'POST' ? 'add' : 'remove'
                }`,
                data: { card_id: id, card_type: type },
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            });

            setFavoriteIds((prev) =>
                isFavorite
                    ? prev.filter((fav) => fav !== `${id}-${type}`)
                    : [...prev, `${id}-${type}`]
            );
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="w-full min-h-svh items-center flex flex-col bg-custom-gradient-2 relative top-16 mb-10">
                <div className="flex justify-center items-center flex-col mt-24 text-white mb-24 w-5/6 h-auto">
                    <h1 className="text-5xl font-bold mb-6">
                        {t('pages.general-text.evit.events')}
                    </h1>
                    <p className="text-2xl font-light">
                        {t('pages.general-text.pick-up-your-preferences')}
                    </p>
                </div>
                <div className="grid grid-cols-4 w-5/6 h-auto">
                    <Filter
                        filterList={[
                            {
                                isPrice: false,
                                name: 'Event Types',
                                inputType: 'checkbox',
                                items: labels.map((label) => ({
                                    display: label,
                                    name: 'Events_checkbox',
                                    id: label.replace(/\s+/g, '_').toLowerCase(),
                                    value: label,
                                })),
                            },
                        ]}
                        selectedValues={{ Events_checkbox: selectedFilters }}
                        handleChange={handleChange}
                        handleSearch={handleSearch}
                        handleResetFilters={handleResetFilters}
                        handleFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
                    />
                    <CardsContainer
                        events={filteredEvents.slice(0, visibleEvents)}
                        loadMoreEvents={loadMoreEvents}
                        allEventsLoaded={allEventsLoaded}
                        isFilterOpen={isFilterOpen}
                        favoriteIds={favoriteIds}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
                <Footer withBackground={false} />
            </div>
        </div>
    );
};

export default SectionWrapper(EventsPage);
