import { useState, useEffect } from 'react';
import IconRatingHalf from "../assets/icons/rating-half.png";
import IconRating from "../assets/icons/rating.png";
import IconPlay from "../assets/icons/play-button.png";
import ImgMovie1 from "../assets/images/temp-1.jpeg";
import ImgMovie2 from "../assets/images/temp-2.jpg";
import Banner1 from "../assets/images/bn1.png";
import Banner2 from "../assets/images/bn2.jpg";

const banners = [
  {
    imgBanner: Banner1,
    title: "Nghe nói em thích tôi",
    type: "TV Show",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    img: ImgMovie1,
    ratings: [IconRating, IconRating, IconRating, IconRating, IconRatingHalf],
  },
  {
    imgBanner: Banner2,
    title: "Ngày xưa có một chuyện tình",
    type:"Movie",
    description: `Ngày Xưa Có Một Chuyện Tình xoay quanh câu chuyện tình bạn, tình yêu giữa hai chàng trai và một cô gái từ thuở ấu thơ cho đến khi trưởng thành, phải đối mặt với những thử thách của số phận. Trải dài trong 4 giai đoạn từ năm 1987 - 2000, ba người bạn cùng tuổi - Vinh, Miền, Phúc đã cùng yêu, cùng bỡ ngỡ bước vào đời, va vấp và vượt qua.`,
    img: ImgMovie2,
    ratings: [IconRating, IconRating, IconRating, IconRating, IconRating],
  },
  // Add more banners if needed
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const { title, description, img, ratings, imgBanner,type } = banners[currentIndex];

  return (
    <div
      className="relative w-full md:h-[660px] h-[1000px] bg-cover bg-center bg-no-repeat"
      // style={{ backgroundImage: `url(${imgBanner})` }}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${imgBanner})`,
      }}
    >
      <div className="w-full h-full bg-black/40 absolute inset-0" />
      <div className="flex flex-col md:flex-row items-center justify-between absolute md:top-1/2 top-10 -translate-x-1/2 left-1/2 md:-translate-y-1/2 w-full">
        <div className="md:w-[50%] w-full p-6 md:p-10">
          <div className="flex flex-col space-y-6 mt-6">
          <p className="bg-gradient-to-r from-red-600 to-red-300 text-white font-bold rounded py-2 px-6 w-fit">
          {type}
            </p>
            <div className="flex flex-col space-y-4">
              <h1 className="text-[40px] font-bold text-white">{title}</h1>
              <div className="flex items-center space-x-3">
                {ratings.map((rating, index) => (
                  <img key={index} src={rating} alt="rating" className="w-8 h-8" />
                ))}
              </div>
              <p className="hidden md:block text-white">{description}</p>
            </div>
            <div className="flex items-center space-x-5">
              <button className="py-2 px-3 bg-black text-white font-bold rounded-xl">
                Chi tiết
              </button>
              <button className="py-2 px-3 bg-red-600 text-white font-bold rounded-xl">
                Xem Phim
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-[50%] w-full flex items-center justify-center">
          <div className="w-[300px] h-[400px] relative group">
            <button className="w-full h-full absolute top-0 left-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
              <img src={IconPlay} alt="play" className="w-16 h-16" />
            </button>
            <img src={img} alt="banner" className="object-cover w-full h-full rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
