import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStore, FaPlus, FaPen, FaBars, FaChartPie, FaUser, FaRightFromBracket, FaBoxOpen } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Footer from "../common/Footer";
import { setUserData } from "@/redux/userSlice";


const OwnerLayout = ({ children }) => {
    const { userData } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const navItems = [
        { name: "Dashboard", icon: <FaChartPie />, path: "/home" },
        { name: "Orders", icon: <FaBoxOpen />, path: "/my-orders" },
        { name: "Add Item", icon: <FaPlus />, path: "/add-item" },
        { name: "Edit Shop", icon: <FaPen />, path: "/create-edit-shop" },
    ];

    const handleLogout = () => {
        dispatch(setUserData(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        setShowLogoutAlert(false);
    };

    // -------- Sidebar Content --------
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            {/* ------------- Logo / Shop Header ------------- */}
            <div className="p-6">
                <Link to="/home" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <FaStore className="text-xl" />
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">
                            Owner Panel
                        </h1>
                        <p className="text-xs text-slate-400 font-medium">
                            Manage your restaurant
                        </p>
                    </div>
                </Link>
            </div>

            <div className="px-6 mb-2">
                <Separator className="bg-slate-800" />
            </div>

            {/* ------------ Sidebar Navigation ------------ */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <Button
                                variant="ghost"
                                className={`w-full justify-start gap-4 h-10 mt-1 rounded-xl text-sm font-bold transition-all cursor-pointer ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary hover:text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* ------------ Footer with Dropdown ------------ */}
            <div className="p-4 bg-slate-950/50 mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors">
                            <Avatar className="h-10 w-10 border-2 border-slate-700">
                                <AvatarImage src={userData?.profileImage} />
                                <AvatarFallback className="bg-slate-900 text-white font-bold">
                                    {userData?.fullName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-bold truncate text-white">
                                    {userData?.fullName || "Owner"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {userData?.email}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-56 bg-slate-900 border-slate-800 text-white mb-2"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="text-slate-400">
                            My Account
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            className="focus:bg-slate-800 focus:text-white cursor-pointer"
                            onClick={() => navigate("/profile")}
                        >
                            <FaUser className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                            onClick={() => setShowLogoutAlert(true)}
                        >
                            <FaRightFromBracket className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );


    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* -------------- Desktop Sidebar -------------- */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* -------------- Main Content -------------- */}
            <main className="flex-1 lg:ml-64 relative flex flex-col min-h-screen">
                
                {/* -------------- Mobile Navbar -------------- */}
                <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaStore className="text-primary text-xl" />
                        <span className="font-bold text-slate-900">Owner Panel</span>
                    </div>

                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-900 hover:bg-gray-100"
                            >
                                <FaBars className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="p-0 border-r-slate-800 w-72 bg-slate-900 text-white"
                        >
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* -------------- Page Content -------------- */}
                <div className="flex-1 mt-4 lg:mt-0 p-2 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>

                {/* -------------- Footer -------------- */}
                <div className="lg:p-4 bg-slate-900">
                    <Footer />
                </div>
            </main>

            {/* ----------- Logout Alert Dialog ----------- */}
            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will sign you out of your account. You will need to log in
                            again to access the dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OwnerLayout;
