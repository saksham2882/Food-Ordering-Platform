import { useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FaLocationDot, FaPlus, FaMagnifyingGlass, FaCartShopping, FaReceipt, FaBars, FaUser, FaXmark } from "react-icons/fa6";
import { setSearchItems, setUserData } from "../redux/userSlice";
import shopApi from "../api/shopApi";
import authApi from "../api/authApi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import debounce from "lodash.debounce";


const Navbar = () => {
  const { userData, currentCity, cartItems } = useSelector(
    (state) => state.user
  );
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const debouncedSearchRef = useRef(null);

  const handleLogOut = async () => {
    try {
      const data = await authApi.signout();
      dispatch(setUserData(null));
      toast.success(data.message || "Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Logout failed");
    }
  };

  useEffect(() => {
    debouncedSearchRef.current = debounce(async (searchQuery) => {
      if (searchQuery.trim()) {
        try {
          const data = await shopApi.searchItems(searchQuery, currentCity);
          dispatch(setSearchItems(data));
        } catch (error) {
          console.error(error);
        }
      } else {
        dispatch(setSearchItems(null));
      }
    }, 300);

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [currentCity, dispatch]);

  const handleSearchItems = useCallback(async (searchQuery) => {
    setQuery(searchQuery);
    debouncedSearchRef.current(searchQuery);
  }, [debouncedSearchRef]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 flex flex-col transition-all">
        <div className="h-[70px] md:h-[80px] w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-20 gap-4">

          {/* ------------ Logo & Mobile Menu ------------ */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-700"
                >
                  <FaBars className="size-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-8 mt-8 px-4">
                  <div className="text-3xl font-black tracking-tighter text-primary">
                    <img
                      src="/logo.svg"
                      alt="FoodXpress"
                      width={160}
                      height={160}
                    />
                  </div>

                  {/* ------------ Mobile Sidebar Content ------------ */}
                  <div className="flex flex-col gap-2">
                    {userData && (
                      <div className="flex items-center gap-3 px-2 py-4 bg-gray-50 rounded-xl mb-2">
                        <Avatar className="size-10 border-2 border-white shadow-sm">
                          <AvatarImage src={userData?.profileImage} />
                          <AvatarFallback className="bg-primary text-white font-bold">
                            {userData?.fullName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">
                            {userData?.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="justify-start gap-3 h-12 text-base font-medium"
                      onClick={() => navigate("/home")}
                    >
                      <FaLocationDot className="text-gray-400" /> Home
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-3 h-12 text-base font-medium"
                      onClick={() => navigate("/profile")}
                    >
                      <FaUser className="text-gray-400" /> Profile
                    </Button>
                    {userData?.role !== "deliveryBoy" && (
                      <Button
                        variant="ghost"
                        className="justify-start gap-3 h-12 text-base font-medium"
                        onClick={() => navigate("/my-orders")}
                      >
                        <FaReceipt className="text-gray-400" /> My Orders
                      </Button>
                    )}

                    <div className="h-px bg-gray-100 my-2" />

                    <Button
                      variant="ghost"
                      className="justify-start gap-3 h-12 text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div
              className="text-2xl font-black tracking-tighter text-primary cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              <img src="/logo.svg" alt="FoodXpress" width={160} height={160} />
            </div>
          </div>


          {/* -------------- Search Bar - Desktop --------------  */}
          {userData?.role === "user" && location.pathname !== "/checkout" && location.pathname !== "/my-orders" && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center relative group">
              <div className="absolute inset-0 bg-gray-100 rounded-full transition-colors group-hover:bg-gray-100/80" />
              <div className="relative flex items-center w-full h-11 px-1">

                {/* ------------ Location ------------ */}
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm m-1 transition-transform hover:scale-[1.02] cursor-pointer shrink-0">
                  <FaLocationDot className="text-orange-500 text-sm" />
                  <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px]">
                    {currentCity || "Location"}
                  </span>
                </div>

                {/* ------------ Search Input ------------ */}
                <FaMagnifyingGlass className="ml-3 text-gray-400 text-sm" />
                <Input
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 h-full text-sm font-medium placeholder:text-gray-400"
                  placeholder="Search for food, restaurant..."
                  value={query}
                  onChange={(e) => handleSearchItems(e.target.value)}
                />
              </div>
            </div>
          )}


          {/* ------------ Roles Actions ------------ */}
          <div className="flex items-center gap-3 shrink-0">
            {userData?.role === "owner" ? (
              <>
                {myShopData && (
                  <Button
                    onClick={() => navigate("/add-item")}
                    className="rounded-full gap-2 hidden sm:flex bg-black hover:bg-gray-800 text-white shadow-lg shadow-black/20"
                  >
                    <FaPlus size={14} /> Add Food
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-orders")}
                  className="rounded-full gap-2 relative border-gray-200"
                >
                  <FaReceipt size={16} />
                  <span className="hidden sm:inline">Orders</span>
                </Button>
              </>
            ) : (
              userData?.role === "user" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-gray-100 text-gray-700 w-10 h-10"
                  onClick={() => navigate("/cart")}
                >
                  <FaCartShopping className="size-5" />
                  {cartItems?.length > 0 && (
                    <Badge className="absolute top-0 right-0 px-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 bg-primary border-[2px] border-white text-[10px]">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              )
            )}


            {/* ------------ Mobile Search Toggle ------------ */}
            {userData?.role === "user" && location.pathname !== "/checkout" && location.pathname !== "/my-orders" && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full text-gray-700"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                {showMobileSearch ? (
                  <FaXmark className="size-5" />
                ) : (
                  <FaMagnifyingGlass className="size-5" />
                )}
              </Button>
            )}


            {/* ------------ Profile Dropdown ------------ */}
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-white shadow-sm hover:shadow-md transition-all size-9 md:size-10">
                    <AvatarImage src={userData?.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-orange-500 text-white font-bold text-sm">
                      {userData?.fullName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 rounded-xl border-gray-100 shadow-xl shadow-gray-200/50 p-2"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-gray-900 leading-none">
                        {userData?.fullName}
                      </p>
                      <p className="text-xs font-medium text-gray-500 leading-none">
                        {userData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-gray-100 my-1" />

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50 font-medium"
                    onClick={() => navigate("/profile")}
                  >
                    <FaUser className="mr-2 size-4 text-gray-400" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  {userData.role === "user" && (
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-3 py-2 text-gray-700 focus:bg-gray-50 font-medium"
                      onClick={() => navigate("/my-orders")}
                    >
                      <FaReceipt className="mr-2 size-4 text-gray-400" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-gray-100 my-1" />

                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-700 font-medium"
                    onClick={() => setShowLogoutConfirm(true)}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="rounded-full px-6 font-bold shadow-primary/30 shadow-lg"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* ------------ Mobile Search Bar ------------ */}
        {showMobileSearch && userData?.role === "user" && location.pathname !== "/checkout" && location.pathname !== "/my-orders" && (
          <div className="md:hidden w-full px-4 pb-4 animate-in slide-in-from-top-2">
            <div className="relative flex items-center w-full h-12 px-1 bg-gray-100 rounded-full">
              <FaMagnifyingGlass className="ml-4 text-gray-400 text-sm" />
              <Input
                className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 h-full text-base font-medium placeholder:text-gray-400"
                placeholder="Search for food..."
                value={query}
                onChange={(e) => handleSearchItems(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
      </nav>


      {/* ------------ Logout Confirmation Dialog ------------ */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">

          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Log out confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-none bg-gray-100 hover:bg-gray-200 font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogOut}
              className="rounded-full bg-red-500 hover:bg-red-600 font-bold shadow-lg shadow-red-500/30"
            >
              Yes, Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Navbar;