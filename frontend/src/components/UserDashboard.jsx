import { use, useEffect, useRef, useState } from "react";
import { categories } from "../assets/category";
import CategoryCard from "./CategoryCard";
import Navbar from "./Navbar";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems } =
    useSelector((state) => state.user);
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate = useNavigate();
  const [showLeftCategoryBtn, setShowLeftCategoryBtn] = useState(false);
  const [showRightCategoryBtn, setShowRightCategoryBtn] = useState(false);
  const [showLeftShopBtn, setShowLeftShopBtn] = useState(false);
  const [showRightShopBtn, setShowRightShopBtn] = useState(false);
  const [filteredItemsList, setFilteredItemsList] = useState([]);

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
      updateButton(
        cateScrollRef,
        setShowLeftCategoryBtn,
        setShowRightCategoryBtn
      );

    const handleShopScroll = () =>
      updateButton(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn);

    if (cateElement) {
      updateButton(
        cateScrollRef,
        setShowLeftCategoryBtn,
        setShowRightCategoryBtn
      );
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

  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setFilteredItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter(
        (i) => i.category === category
      );
      setFilteredItemsList(filteredList);
    }
  };

  useEffect(() => {
    setFilteredItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-bg overflow-y-auto">
      <Navbar />

      {/* ------------- Searched Items ------------ */}
      {searchItems && searchItems?.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">
            Search Results
          </h1>

          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems?.map((item) => (
              <FoodCard data={item} key={item._id} />
            ))}
          </div>
        </div>
      )}

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
                onClick={() => handleFilterByCategory(cate.category)}
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
              <CategoryCard
                name={shop.name}
                image={shop.image}
                key={index}
                onClick={() => navigate(`/shop/${shop._id}`)}
              />
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
          {filteredItemsList?.length == 0 ? (
            <p className="text-lg text-gray-600 font-semibold">
              No Available Item
            </p>
          ) : (
            filteredItemsList?.map((item, index) => (
              <FoodCard key={index} data={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
