import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import userApi from "../api/userApi";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUser, FaEnvelope, FaPhone, FaIdBadge, FaMapMarkerAlt, FaMotorcycle, FaStore, FaLock, FaArrowLeft, FaCalendarAlt, FaUtensils, FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";


const Profile = () => {
    const { userData, currentCity } = useSelector((state) => state.user);
    const { myShopData } = useSelector((state) => state.owner);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Profile Form State
    const [formData, setFormData] = useState({
        fullName: userData?.fullName || "",
        mobile: userData?.mobile || "",
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const validateProfile = () => {
        if (formData.fullName.trim().length < 2) {
            toast.error("Full Name must be at least 2 characters");
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            toast.error("Mobile number must be 10 digits");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!passwordData.currentPassword) {
            toast.error("Current password is required");
            return false;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return false;
        }
        return true;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        setIsLoading(true);
        try {
            const data = await userApi.updateProfile(formData);
            dispatch(setUserData(data.user));
            toast.success(data.message || "Profile updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setIsLoading(true);
        try {
            const data = await userApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success(data.message || "Password changed successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "owner":
                return "bg-blue-500 hover:bg-blue-600";
            case "deliveryBoy":
                return "bg-orange-500 hover:bg-orange-600";
            default:
                return "bg-green-500 hover:bg-green-600";
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case "owner":
                return <FaStore className="w-4 h-4 mr-1" />;
            case "deliveryBoy":
                return <FaMotorcycle className="w-4 h-4 mr-1" />;
            default:
                return <FaUser className="w-4 h-4 mr-1" />;
        }
    };


    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 lg:px-8 mb-20 lg:mb-0">
            {/* ------------ Back & Home Button ------------ */}
            <div className="mb-4 flex justify-start gap-4">
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 bg-primary/10 hover:shadow-md rounded-full transition-colors cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Back
                </Button>
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 bg-primary/10 hover:shadow-md rounded-full transition-colors cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    <FaHome /> Home
                </Button>
            </div>

            <Separator className="my-6 opacity-50" />

            <div className="flex flex-col md:flex-row gap-8">
                {/* --------- Profile Sidebar --------- */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="overflow-hidden border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow bg-white/50 backdrop-blur-sm">
                        <div className="h-32 bg-gradient-to-br from-primary/20 to-orange-500/50 relative">
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-orange-500 text-white">
                                        {userData?.fullName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <CardContent className="pt-16 pb-8 text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {userData?.fullName}
                            </h2>
                            <p className="text-sm text-gray-500">{userData?.email}</p>
                            <div className="flex justify-center mt-4 gap-2">
                                <Badge
                                    className={`${getRoleBadgeColor(userData?.role)} px-3 py-1 text-sm capitalize`}
                                >
                                    {getRoleIcon(userData?.role)}
                                    {userData?.role === "deliveryBoy" ? "Delivery Partner" : userData?.role}
                                </Badge>
                            </div>
                            {userData?.createdAt && (
                                <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                                    <FaCalendarAlt /> Joined{" "}
                                    {new Date(userData.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* --------- Shop Stats Card --------- */}
                    {userData?.role === "owner" && myShopData && (
                        <Card className="border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow bg-blue-50/50 backdrop-blur-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <FaUtensils className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1">Shop Info:</p>
                                    <p className="text-md font-bold text-gray-700">
                                        {myShopData.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {myShopData.address}, {myShopData.city}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* --------- Main Content Tabs --------- */}
                <div className="w-full md:w-2/3">
                    <Tabs defaultValue="account" className="w-full">

                        {/* --------- Tabs List --------- */}
                        <TabsList className="bg-white/80 border grid w-full grid-cols-2 mb-3 p-1 rounded-xl h-auto relative">
                            <TabsTrigger 
                                value="account"
                                className="p-1.5 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all"
                            >
                                Account Details
                            </TabsTrigger>
                            <TabsTrigger 
                                value="security"
                                className="p-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
                            >
                                Security
                            </TabsTrigger>
                        </TabsList>

                        {/* --------- Account Details Tab --------- */}
                        <TabsContent value="account">
                            <Card className="border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <FaIdBadge className="text-primary" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your personal details and account settings.
                                    </CardDescription>
                                </CardHeader>

                                <Separator />

                                <CardContent className="space-y-6 pt-6">
                                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="fullName"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FaUser className="text-gray-400" /> Full Name
                                                </Label>
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="mobile"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FaPhone className="text-gray-400" /> Mobile Number
                                                </Label>
                                                <Input
                                                    id="mobile"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                    placeholder="Enter your mobile number"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FaEnvelope className="text-gray-400" /> Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    value={userData?.email}
                                                    disabled
                                                    className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="role"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FaIdBadge className="text-gray-400" /> Account Role
                                                </Label>
                                                <Input
                                                    id="role"
                                                    value={
                                                        userData?.role === "deliveryBoy"
                                                            ? "Delivery Partner"
                                                            : userData?.role
                                                    }
                                                    disabled
                                                    className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed capitalize"
                                                />
                                            </div>
                                        </div>

                                        {userData?.role === "deliveryBoy" && (
                                            <>
                                                <Separator className="my-6" />
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        <FaMotorcycle className="text-primary" /> Delivery
                                                        Details
                                                    </h3>
                                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                                        <div className="flex items-center gap-2 text-orange-800">
                                                            <FaMapMarkerAlt />
                                                            <span className="font-medium">
                                                                Current Location Tracking:
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-white text-orange-600 border-orange-200"
                                                            >
                                                                {userData?.location?.coordinates
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-orange-600 mt-2">
                                                            Your location is tracked while you are online to
                                                            assign nearby orders.
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {userData?.role === "user" && currentCity && (
                                            <>
                                                <Separator className="my-6" />
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-primary" />{" "}
                                                        Preferences
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2">
                                                                Current City
                                                            </Label>
                                                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                                                                <FaLocationDot className="text-orange-500" />
                                                                {currentCity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-end pt-6">
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow cursor-pointer"
                                            >
                                                {isLoading && (
                                                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ----------- Security Tab ----------- */}
                        <TabsContent value="security">
                            <Card className="border-2 border-gray-200/50 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <FaLock className="text-primary" />
                                        Security Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Update your password and manage account security.
                                    </CardDescription>
                                </CardHeader>

                                <Separator />

                                <CardContent className="space-y-6 pt-6">
                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">
                                                    Confirm New Password
                                                </Label>
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                                    placeholder="Re-enter new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-2 border border-blue-100">
                                            <FaLock className="mt-1 shrink-0" />
                                            <div>
                                                <p className="font-semibold">Password Requirements:</p>
                                                <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                                                    <li>Minimum 8 characters long</li>
                                                    <li>
                                                        Include at least one number and special character
                                                        (Recommended)
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6">
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow cursor-pointer"
                                            >
                                                {isLoading && (
                                                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Change Password
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Profile;
