"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';

export default function Banner() {
  return (
    <div className="mt-6">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden"
      >
        <SwiperSlide>
          <div className="w-full h-full bg-base-200 flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Discover Your Next Great Read</h2>
            <p className="mb-6 max-w-lg">Explore thousands of books across multiple genres. Borrow and read at your own pace.</p>
            <Link href="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full bg-base-200 flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Share Your Favorite Books</h2>
            <p className="mb-6 max-w-lg">Add books to our library and help build a community of passionate readers.</p>
            <Link href="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full bg-base-200 flex flex-col justify-center items-center text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Seamless Borrowing Experience</h2>
            <p className="mb-6 max-w-lg">Borrow easily, track your reading, and return with just a click. All for free!</p>
            <Link href="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}