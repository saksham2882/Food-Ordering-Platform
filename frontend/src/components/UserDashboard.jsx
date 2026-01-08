import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import FoodCard from "./FoodCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categories } from "../assets/category";
import { FaMagnifyingGlass, FaArrowRightLong, FaX } from "react-icons/fa6";
import useGetCity from "../hooks/useGetCity";
import useGetShopByCity from "../hooks/useGetShopByCity";
import useGetItemsByCity from "../hooks/useGetItemsByCity";
import useUpdateLocation from "../hooks/useUpdateLocation";
import UserLayout from "./layouts/UserLayout";
import { setCurrentCity } from "../redux/userSlice";
import { setLocation } from "../redux/mapSlice";
import { FaStore } from "react-icons/fa";


const UserDashboard = () => {
  useGetCity();
  useGetShopByCity();
  useGetItemsByCity();
  useUpdateLocation();

  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredItemsList, setFilteredItemsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleFilterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredItemsList(itemsInMyCity);
    } else {
      const filteredList = itemsInMyCity?.filter((i) => i.category === category);
      setFilteredItemsList(filteredList);
    }
  };

  useEffect(() => {
    setFilteredItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  return (
    <UserLayout>
      <div className="flex flex-col gap-8 md:gap-12 font-sans fade-in-up">

        {/* ------------- Banner ------------- */}
        <section className="relative w-full h-[320px] md:h-[450px] lg:h-[500px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl shadow-orange-500/20 group">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2075"
            alt="Hero Food"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
          />

          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-20 space-y-4 md:space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full w-fit border border-white/10">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white text-xs md:text-sm font-semibold tracking-wide uppercase">Delivering to {currentCity}</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
              Craving Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Extraordinary?</span>
            </h1>

            <p className="text-white/90 text-sm md:text-lg lg:text-xl font-medium max-w-lg leading-relaxed hidden sm:block">
              Order from the top-rated restaurants in your area and get lightning-fast delivery.
            </p>

            <Button
              className="bg-primary hover:bg-orange-600 text-white font-bold rounded-full h-12 md:h-14 px-6 md:px-8 text-base md:text-lg shadow-xl shadow-primary/30 w-fit gap-2 md:gap-3 mt-2"
              onClick={() => document.getElementById("recommended").scrollIntoView({ behavior: 'smooth' })}
            >
              Order Now <FaArrowRightLong />
            </Button>
          </div>
        </section>


        {/* ------------- Search Results ------------ */}
        {searchItems && searchItems.length > 0 && (
          <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 border-b pb-4 border-gray-100">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <FaMagnifyingGlass className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                <p className="text-gray-500 text-sm">Found {searchItems.length} items matching your search</p>
              </div>
            </div>

            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4 py-4">
                {searchItems.map((item) => (
                  <CarouselItem key={item._id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <FoodCard data={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white text-primary border-primary/20 hover:border-primary shadow-lg h-9 w-9 md:h-11 md:w-11 md:left-0 md:-translate-x-1/2" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white text-primary border-primary/20 hover:border-primary shadow-lg h-9 w-9 md:h-11 md:w-11 md:right-0 md:translate-x-1/2" />
            </Carousel>
          </section>
        )}


        {/* ------------- Categories ------------- */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Categories</h2>
              <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">Explore our wide range of delicious options</p>
            </div>
          </div>

          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-3 py-4">
              {categories.map((cate, index) => (
                <CarouselItem key={index} className="basis-auto pl-6">
                  <CategoryCard
                    name={cate.category}
                    image={cate.image}
                    onClick={() => handleFilterByCategory(cate.category)}
                    className={activeCategory === cate.category ? "ring-4 ring-primary ring-offset-2 scale-105" : ""}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="flex -left-2 lg:-left-5 bg-white shadow-lg border-none text-primary hover:text-white hover:bg-primary transition-all rounded-full h-8 w-8 lg:h-12 lg:w-12" />
            <CarouselNext className="flex -right-2 lg:-right-5 bg-white shadow-lg border-none text-primary hover:text-white hover:bg-primary transition-all rounded-full h-8 w-8 lg:h-12 lg:w-12" />
          </Carousel>
        </section>


        {/* ------------- Best Shops ------------- */}
        <section className="space-y-6 bg-gray-50 rounded-[24px] md:rounded-[32px] p-5 md:p-10 -mx-4 md:mx-0">
          <div className="flex items-center justify-between px-2 md:px-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Top Restaurants</h2>
              <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">The best rated shops in {currentCity}</p>
            </div>
            <Button variant="outline" className="rounded-full hidden sm:flex border-gray-300">View All</Button>
          </div>

          {!shopsInMyCity ? (
            <div className="flex gap-4 overflow-hidden px-2 md:px-0">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-[180px] h-[120px] md:w-[200px] md:h-[150px] rounded-xl shrink-0" />
              ))}
            </div>
          ) : shopsInMyCity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <FaStore className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">No restaurants found in {currentCity}</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  We haven't expanded to your area yet.
                </p>
              </div>
            </div>
          ) : (
            <Carousel opts={{ align: "start" }} className="w-full px-2 md:px-0">
              <CarouselContent className="-ml-4 pb-4">
                {shopsInMyCity.map((shop) => (
                  <CarouselItem key={shop._id} className="basis-auto pl-4">
                    <CategoryCard
                      name={shop.name}
                      image={shop.image}
                      className="w-[200px] h-[130px] md:w-[240px] md:h-[160px] rounded-xl"
                      onClick={() => navigate(`/shop/${shop._id}`)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="flex -left-2 lg:-left-4 bg-white shadow-md text-gray-800 hover:bg-primary hover:text-white border-0 h-8 w-8 lg:h-10 lg:w-10" />
              <CarouselNext className="flex -right-2 lg:-right-4 bg-white shadow-md text-gray-800 hover:bg-primary hover:text-white border-0 h-8 w-8 lg:h-10 lg:w-10" />
            </Carousel>
          )}

          {/* --------- No Shops Dialog ------------- */}
          <Dialog open={shopsInMyCity?.length === 0}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="mx-auto bg-orange-100 p-3 rounded-full mb-2">
                  <FaStore className="w-6 h-6 text-orange-500" />
                </div>
                <DialogTitle className="text-center text-xl">No Restaurants Found</DialogTitle>
                <DialogDescription className="text-center">
                  We haven't expanded to <strong>{currentCity}</strong> yet. <br />
                  Would you like to visit our demo location?
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  onClick={() => {
                    dispatch(setLocation({ lat: 28.4744, lon: 77.5040 }));
                    dispatch(setCurrentCity("Greater Noida"));
                  }}
                  className="w-full rounded-full font-bold shadow-lg shadow-primary/20"
                >
                  View Demo Location (Greater Noida)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </section>


        {/* ------------- Food Items ------------- */}
        <section id="recommended" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Recommended For You
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{filteredItemsList?.length || 0} items</span>
              </h2>
            </div>

            {activeCategory !== "All" && (
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 w-fit">
                <span className="text-sm font-medium text-gray-600">Filtering: <span className="font-bold text-primary">{activeCategory}</span></span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterByCategory("All")}
                  className="h-6 w-6 p-0 rounded-full hover:bg-white text-gray-400 hover:text-red-500"
                >
                  <FaX size={15} className="font-extrabold" />
                </Button>
              </div>
            )}
          </div>

          {filteredItemsList?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <span className="text-4xl">🥗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">No items found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2 mb-6">
                We couldn't find any items in the "{activeCategory}" category.
              </p>
              <Button onClick={() => handleFilterByCategory("All")} className="rounded-full px-8 font-bold">
                View All Menu
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10 justify-items-center sm:justify-items-stretch">
              {filteredItemsList?.map((item) => (
                <FoodCard key={item._id} data={item} />
              ))}
            </div>
          )}
        </section>

      </div>
    </UserLayout>
  );
};

export default UserDashboard;
