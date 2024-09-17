/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    A11y,
    Autoplay,
    EffectCoverflow,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Carousel.css'; // Ensure this is correctly imported
import 'swiper/css/effect-coverflow';
import CarouselCard from './CarouselCard';

const SwiperCarousel = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Function to fetch data from the Flask API
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/courses');
                if (response.ok) {
                    const result = await response.json();
                    // Limit to 5 items
                    setData(result.slice(0, 5));
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay, EffectCoverflow]}
            spaceBetween={0}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 3 },
            }}
            centeredSlides={true}
            initialSlide={1}
            loop={true}
            navigation
            effect="coverflow"
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            }}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="custom-swiper mb-24 w-full md:w-[80%]"
        >
            {data.map(item => (
                <SwiperSlide key={item.id} className="custom-slide">
                    <CarouselCard
                        id={item.id}
                        card_title={item.title}
                        card_description={item.description}
                        card_price={item.price}
                        card_img={item.image_url} // Ensure this matches the property from the API
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperCarousel;
