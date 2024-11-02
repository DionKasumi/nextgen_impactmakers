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
import '../styles/Carousel.css';
import 'swiper/css/effect-coverflow';
import CarouselCard from './CarouselCard';
import axios from 'axios';
import SkeletonCard from './SkeletonCard';

axios.defaults.withCredentials = true;

const SwiperCarousel = ({ data = [] }) => {
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
            {data.length === 0
                ? // Render 3 SkeletonCard slides when data is loading
                  Array(5)
                      .fill(null)
                      .map((_, index) => (
                          <SwiperSlide key={index} className="custom-slide">
                              <SkeletonCard isSwiperCard={true} />
                          </SwiperSlide>
                      ))
                : // Map through actual data if available
                  data.map((item) => (
                      <SwiperSlide key={item.id} className="custom-slide">
                          <CarouselCard
                              id={item.id}
                              card_title={item.title}
                              card_description={item.description}
                              card_price={item.price}
                              card_img={item.image_url}
                              card_duration={item.duration}
                              card_source={item.source}
                              card_type={item.type}
                          />
                      </SwiperSlide>
                  ))}
        </Swiper>
    );
};

export default SwiperCarousel;
