import { useEffect, useRef, useState } from "react";
import { categories } from "../assets/category";
import CategoryCard from "./CategoryCard";
import Navbar from "./Navbar";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { currentCity } = useSelector((state) => state.user);
  const cateScrollRef = useRef();
  const [showLeftCategoryBtn, setShowLeftCategoryBtn] = useState(false);
  const [showRightCategoryBtn, setShowRightCategoryBtn] = useState(false);

  const updateButton = (ref, setLeftBtn, setRightBtn) => {
    const element = ref.current;
    if (element) {
      setLeftBtn(element.scrollLeft > 0);
      setRightBtn(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
      // console.log("client width: ", element.clientWidth)
      // console.log("scroll width: ", element.scrollWidth)
      // console.log("scroll left: ", element.scrollLeft)
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (cateScrollRef.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCategoryBtn,
        setShowRightCategoryBtn
      );
      cateScrollRef.current.addEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCategoryBtn,
          setShowRightCategoryBtn
        );
      });
    }

    return () =>
      cateScrollRef.current.removeEventListener("scroll", () => {
        updateButton(
          cateScrollRef,
          setShowLeftCategoryBtn,
          setShowRightCategoryBtn
        );
      });
  }, [categories]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Navbar />

      {/* ------------- Food Category ------------- */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-700 text-xl sm:text-2xl">
          Inspiration for your first order
        </h1>

        {/* ----------- Food Categories Slider --------------- */}
        <div className="w-full relative">
          {/* -------------- Left Button ------------- */}
          {showLeftCategoryBtn && (
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10 cursor-pointer"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaCircleChevronLeft size={25} />
            </button>
          )}

          {/* -------------- Categories --------------- */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard data={cate} key={index} />
            ))}
          </div>

          {/* -------------- Right Button ------------- */}
          {showRightCategoryBtn && (
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10 cursor-pointer"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaCircleChevronRight size={25} />
            </button>
          )}
        </div>
      </div>

      {/* ------------- Shops by Location -------------- */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-700 text-xl sm:text-2xl">
          Best Shop in {currentCity}
        </h1>
      </div>
    </div>
  );
};

export default UserDashboard;
