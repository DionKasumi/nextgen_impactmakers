/* eslint-disable react/prop-types */
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
    return (
        <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay, EffectCoverflow]}
            spaceBetween={0}
            breakpoints={{
                // when window width is <= 640px
                640: {
                    slidesPerView: 1,
                },
                // when window width is <= 768px
                768: {
                    slidesPerView: 1,
                },
                // when window width is > 768px
                1024: {
                    slidesPerView: 3,
                },
            }}
            centeredSlides={true}
            initialSlide={1}
            loop={true}
            navigation
            effect="coverflow"
            coverflowEffect={{
                rotate: 50, // Rotation angle of the slides
                stretch: 0, // Spacing between slides
                depth: 100, // Depth of slides (higher means more depth)
                modifier: 1, // Multiplier for perspective and scaling effect
                slideShadows: false, // Enable shadows for depth effect
            }}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            className="custom-swiper mb-24 w-full md:w-[80%]"
        >
            <SwiperSlide className="custom-slide">
                <CarouselCard id={1} card_description={'Example'} />
            </SwiperSlide>
            <SwiperSlide className="custom-slide">
                <CarouselCard id={2} />
            </SwiperSlide>
            <SwiperSlide className="custom-slide">
                <CarouselCard id={3} />
            </SwiperSlide>
            <SwiperSlide className="custom-slide">
                <CarouselCard id={4} />
            </SwiperSlide>
        </Swiper>
    );
};

export default SwiperCarousel;
