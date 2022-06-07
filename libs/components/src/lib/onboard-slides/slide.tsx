import React from "react";
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

export interface SlideProps {
  title: string;
  children: React.ReactNode;
}

export const SlideContent: React.FC<SlideProps> = ({ children, title }) => {
  return (
    <div className="mb-8 h-full flex-grow">
      <div className="font-palanquin py-4 text-center text-2xl font-extrabold">
        {title}
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export default SlideContent;
