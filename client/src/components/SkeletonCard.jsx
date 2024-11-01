import Skeleton from '@mui/material/Skeleton';
import { useSwiperSlide } from 'swiper/react';

const SkeletonCard = ({ isSwiperCard = false }) => {
    const swiperSlide = isSwiperCard ? useSwiperSlide() : null;
    return (
        <div
            className={`w-64 h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-white rounded-[16px] lg:rounded-[20px] xl:rounded-[24px] p-2 lg:p-3 xl:p-4 transition-all box-border select-none shadow-lg ${
                swiperSlide != null && !swiperSlide.isActive
                    ? 'scale-75'
                    : 'scale-100'
            }`}
        >
            <div className="w-full h-4/6 bg-gray-400 flex flex-col justify-center items-center rounded-[8px] relative">
                <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={'100%'}
                    height={'100%'}
                />
            </div>
            <div className="w-full h-2/6 flex justify-between flex-col">
                <div className="mt-1 lg:mt-2">
                    <div className="flex flex-row justify-between">
                        <Skeleton animation="wave" width={'50%'} />
                        <Skeleton animation="wave" width={'45%'} />
                    </div>
                    <Skeleton animation="wave" height={'100%'} />
                </div>
                <div className="flex w-full h-1/4 justify-between items-center flex-row">
                    <Skeleton animation="wave" width="35%" height="100%" />
                    <Skeleton animation="wave" width="60%" height="100%" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
