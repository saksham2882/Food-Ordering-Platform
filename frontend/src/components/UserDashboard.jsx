import { useEffect, useRef, useState } from "react";
import { categories } from "../assets/category";
import CategoryCard from "./CategoryCard";
import Navbar from "./Navbar";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

const UserDashboard = () => {
  const { currentCity, shopsInMyCity, itemsInMyCity } = useSelector((state) => state.user);
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const [showLeftCategoryBtn, setShowLeftCategoryBtn] = useState(false);
  const [showRightCategoryBtn, setShowRightCategoryBtn] = useState(false);
  const [showLeftShopBtn, setShowLeftShopBtn] = useState(false);
  const [showRightShopBtn, setShowRightShopBtn] = useState(false);

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
    const cateElement = cateScrollRef.current;
    const shopElement = shopScrollRef.current;

    const handleCateScroll = () =>
      updateButton(cateScrollRef, setShowLeftCategoryBtn, setShowRightCategoryBtn);

    const handleShopScroll = () =>
      updateButton(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn);

    if (cateElement) {
      updateButton(cateScrollRef, setShowLeftCategoryBtn, setShowRightCategoryBtn);
      cateElement.addEventListener("scroll", handleCateScroll);
    }

    if (shopElement) {
      updateButton(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn);
      shopElement.addEventListener("scroll", handleShopScroll);
    }

    return () => {
      if (cateElement)
        cateElement.removeEventListener("scroll", handleCateScroll);
      if (shopElement)
        shopElement.removeEventListener("scroll", handleShopScroll);
    };

  }, [shopsInMyCity]);

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
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
              />
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

        {/* -------------- Shops Slider ------------- */}
        <div className="w-full relative">
          {/* -------------- Left Button ------------- */}
          {showLeftShopBtn && (
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10 cursor-pointer"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={25} />
            </button>
          )}

          {/* -------------- Categories --------------- */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {/* -------------- Right Button ------------- */}
          {showRightShopBtn && (
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-hover z-10 cursor-pointer"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={25} />
            </button>
          )}
        </div>
      </div>

      {/* ------------- Food Items By My City -------------  */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-700 text-xl sm:text-2xl">
          Suggested Food Items
        </h1>

        {/* --------------- Items ------------ */}
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemsInMyCity?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
