import { useNavigate } from "react-router-dom";
import { Utensils, Clock, Smartphone, MapPin, ChefHat, Star, ArrowRight, Salad, Pizza, Coffee, Beer, Wine, IceCream, Sandwich, Soup, Croissant, Heart, ShoppingBag, Quote, Bell, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import Footer from "../components/common/Footer";
import Appetizers from "../assets/Appetizers.jpg";
import Biryani from "../assets/Biryani.jpg";
import Noodles from "../assets/Noodles.webp";
import Desserts from "../assets/Dessert.jpeg";
import Indian_food from "../assets/Indian_food.jpg";

const LandingPage = () => {
    const navigate = useNavigate();

    const categories = [
        { name: "Fast Food", icon: <Pizza className="w-8 h-8 text-orange-500" />, count: "20+ Options" },
        { name: "Pizza", icon: <Pizza className="w-8 h-8 text-red-500" />, count: "15+ Options" },
        { name: "Burger", icon: <Sandwich className="w-8 h-8 text-amber-700" />, count: "10+ Options" },
        { name: "Healthy", icon: <Salad className="w-8 h-8 text-green-500" />, count: "12+ Options" },
        { name: "Biryani", icon: <Utensils className="w-8 h-8 text-orange-600" />, count: "18+ Options" },
        { name: "Desserts", icon: <IceCream className="w-8 h-8 text-pink-500" />, count: "15+ Options" },
        { name: "Beverages", icon: <Beer className="w-8 h-8 text-amber-500" />, count: "10+ Options" },
        { name: "Coffee", icon: <Coffee className="w-8 h-8 text-amber-900" />, count: "8+ Options" },
        { name: "Bakery", icon: <Croissant className="w-8 h-8 text-orange-400" />, count: "14+ Options" },
        { name: "Soup", icon: <Soup className="w-8 h-8 text-red-400" />, count: "8+ Options" },
        { name: "Wine", icon: <Wine className="w-8 h-8 text-purple-600" />, count: "5+ Options" },
        { name: "Indian", icon: <Utensils className="w-8 h-8 text-orange-600" />, count: "25+ Options" },
    ];

    const popularDishes = [
        { name: "Appetizers", price: "₹250", image: Appetizers, rating: 4.9 },
        { name: "Chicken Biryani", price: "₹280", image: Biryani, rating: 4.8 },
        { name: "Noodles", price: "₹220", image: Noodles, rating: 4.7 },
        { name: "Desserts", price: "₹120", image: Desserts, rating: 4.6 },
    ];

    const testimonials = [
        { name: "Sakshi Sharma", role: "Food Blogger", text: "The delivery is insanely fast! Food arrived hot and fresh as if it just came out of the oven." },
        { name: "James Anderson", role: "Developer", text: "Love the app interface. So smooth and easy to use. The tracking feature is accurate." },
        { name: "Nancy Mathew", role: "Marketing", text: "Best food quality and delivery service I've used. The variety of restaurants is amazing!" },
    ];

    return (
        <div className="w-full min-h-screen bg-bg overflow-x-hidden font-sans">
            {/* ----------- 1. Navbar ----------- */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-3">
                        <Utensils className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                        <img src="/logo.svg" alt="FoodXpress" className="w-28 md:w-[150px] h-auto" />
                    </div>
                    <div className="hidden md:flex gap-8 font-medium text-gray-600">
                        <a href="#home" className="hover:text-primary transition-colors">Home</a>
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
                        <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={() => navigate("/signin")}>Sign In</Button>
                        <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                    </div>
                </div>
            </div>


            {/* ----------- 2. Hero Section ----------- */}
            <section id="home" className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50/50 -z-10 rounded-l-[100px] hidden lg:block"></div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-up">
                        <Badge variant="secondary" className="px-4 py-2 text-primary bg-orange-100 font-medium text-sm rounded-full">
                            ✨ #1 Best Food Quality
                        </Badge>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1]">
                            Delicious Food, <br />
                            <span className="text-primary">Instantly.</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
                            Order from the best local restaurants with easy, on-demand delivery. Freshness guaranteed.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-shadow" onClick={() => navigate("/home")}>
                                Order Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 hover:border-primary transition-colors" onClick={() => navigate("/home")}>
                                View Menu
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium">
                                <span className="text-primary font-bold">10k+</span> Happy Eaters
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 lg:ml-auto">
                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-yellow-400/10 rounded-full blur-3xl -z-10"></div>
                            <img
                                src={Indian_food}
                                alt="Delicious Indian Veg Food"
                                className="w-[500px] h-[500px] object-cover rounded-full border-8 border-white shadow-2xl hover:scale-105 transition-transform duration-700"
                            />
                            {/* ----- Floating Cards ----- */}
                            <Card className="absolute top-10 -left-10 w-48 shadow-xl hidden md:block border-none">
                                <CardContent className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-xl">
                                    <div className="bg-green-100 p-2 rounded-full text-green-600"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Delivery Time</p>
                                        <p className="font-bold text-gray-900">25 Mins</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="absolute bottom-10 -right-4 w-48 shadow-xl hidden md:block border-none">
                                <CardContent className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-sm rounded-xl">
                                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600"><Star size={20} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500">Customer Rating</p>
                                        <p className="font-bold text-gray-900">4.9/5</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* ----------- 3. Stats Section ----------- */}
            <section className="bg-primary/5 py-12 border-y border-orange-100">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Daily Orders", value: "1000+" },
                        { label: "Restaurants", value: "120+" },
                        { label: "Menu Items", value: "100+" },
                        { label: "Delivery Staff", value: "150+" }
                    ].map((stat, idx) => (
                        <div key={idx}>
                            <h3 className="text-3xl md:text-4xl font-black text-primary mb-1">{stat.value}</h3>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* ----------- 4. Feature Section ----------- */}
            <section id="features" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Service</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Why FoodXpress is the Best</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <ChefHat className="w-10 h-10 text-primary group-hover:text-white transition-colors" />, title: "Quality Food", desc: "Partnered with top-rated restaurants to ensure hygiene and great taste." },
                            { icon: <Clock className="w-10 h-10 text-primary group-hover:text-white transition-colors" />, title: "Fast Delivery", desc: "We prioritize speed so you can enjoy your food while it is still hot and fresh." },
                            { icon: <MapPin className="w-10 h-10 text-primary group-hover:text-white transition-colors" />, title: "Live Tracking", desc: "Track your order journey from the kitchen to your doorstep in real-time." },
                        ].map((item, idx) => (
                            <Card key={idx} className="border border-transparent hover:border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                                <CardContent className="p-8 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* ----------- 5. Populer Categories ----------- */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
                            <p className="text-gray-500 mt-2">Find what matches your taste</p>
                        </div>
                    </div>

                    <Carousel className="w-full max-w-5xl mx-auto relative px-12 md:px-0" opts={{ align: "start", loop: true }}>
                        <CarouselContent className="-ml-4">
                            {categories.map((cat, idx) => (
                                <CarouselItem key={idx} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:border-primary transition-colors cursor-pointer text-center h-full justify-center group">
                                        <div className="mb-4 bg-gray-50 p-3 rounded-full group-hover:scale-110 transition-transform">{cat.icon}</div>
                                        <h3 className="font-bold text-gray-800">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0 md:-left-12 bg-white border-gray-200 hover:bg-primary hover:text-white" />
                        <CarouselNext className="right-0 md:-right-12 bg-white border-gray-200 hover:bg-primary hover:text-white" />
                    </Carousel>
                </div>
            </section>


            {/* ----------- 6. Featured Menu Items (Grid) ----------- */}
            <section id="menu" className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <Badge variant="outline" className="mb-3 border-primary/20 text-primary bg-primary/5">Customer Favorites</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Most Popular Dishes</h2>
                        <p className="text-gray-500 text-lg">Curated selection of our best-selling dishes, ordered and loved by thousands.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {popularDishes.map((dish, idx) => (
                            <Card key={idx} className="group overflow-hidden border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 rounded-3xl bg-white">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 font-bold shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" /> {dish.rating}
                                    </Badge>

                                    <Button size="icon" variant="ghost" className="absolute top-4 left-4 bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-full h-8 w-8 transition-colors">
                                        <Heart size={16} />
                                    </Button>

                                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden md:block">
                                        <Button className="w-full rounded-full bg-white text-gray-900 hover:bg-primary hover:text-white shadow-lg font-semibold" onClick={() => navigate("/signup")}>
                                            Order Now
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-1">{dish.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">Delicious Indian cuisine prepared with authentic spices and fresh ingredients.</p>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                        <span className="text-2xl font-black text-gray-900">{dish.price}</span>
                                        <Button size="sm" className="rounded-full px-5 bg-orange-100 text-primary hover:bg-primary hover:text-white font-bold md:hidden" onClick={() => navigate("/home")}>
                                            <ShoppingBag size={16} className="mr-2" /> Add
                                        </Button>
                                        <Button size="icon" className="rounded-full bg-gray-900 text-white hover:bg-primary shadow-md w-10 h-10 hidden md:flex" onClick={() => navigate("/home")}>
                                            <ShoppingBag size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-2 hover:bg-gray-50 hover:border-gray-900 hover:text-gray-900 transition-all" onClick={() => navigate("/home")}>
                            View Full Menu <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>


            {/* ----------- 7. Testimonials Section ----------- */}
            <section id="testimonials" className="py-24 bg-orange-50/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">What Our Happy Eaters Say</h2>
                        <p className="text-gray-500 text-lg">Over 10,000+ satisfied customers enjoying our service every day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <Card key={idx} className="border-none shadow-lg shadow-orange-100/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white relative group">
                                <CardContent className="p-8 pt-12 relative">
                                    <div className="absolute top-8 right-8 text-orange-100 group-hover:text-orange-200 transition-colors">
                                        <Quote size={64} className="fill-current" />
                                    </div>
                                    <div className="flex gap-1 mb-6 relative z-10">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-8 leading-relaxed text-lg relative z-10 font-medium">"{testimonial.text}"</p>

                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                        <div className="p-1 bg-gradient-to-br from-primary to-yellow-400 rounded-full">
                                            <Avatar className="h-12 w-12 border-2 border-white">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${idx + 20}`} />
                                                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                                            <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* ----------- 8. App Download Section ----------- */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative flex justify-center">
                        <div className="relative w-64 md:w-72 h-[500px] border-[12px] border-gray-950 rounded-[3rem] bg-gray-900 shadow-2xl overflow-hidden z-10 rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                            <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" alt="App Screen" />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center">
                                    <Smartphone className="w-10 h-10 mx-auto mb-2 text-white" />
                                    <span className="text-white font-bold tracking-widest text-sm">COMING SOON</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-10 right-10 w-20 h-20 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                    </div>

                    <div className="order-1 md:order-2 space-y-8 text-center md:text-left">
                        <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 tracking-wider">FUTURE RELEASE</Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            Experience FoodXpress <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">On The Go</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
                            We are building a seamless mobile experience for you. Track orders live, get exclusive app deals, and reorder favorites in one tap.
                        </p>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-md mx-auto md:mx-0 backdrop-blur-sm">
                            <h4 className="font-bold text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Bell className="text-primary w-5 h-5" /> Get Notified When We Launch
                            </h4>
                            <div className="flex gap-2">
                                <Input type="email" placeholder="Enter your email" className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-lg focus-visible:ring-primary" />
                                <Button className="bg-primary hover:bg-orange-600 text-white rounded-lg px-6 font-bold">
                                    Notify Me
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">We promise not to spam. You'll only hear from us when the app is ready.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* ----------- 9. Newsletter ----------- */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="bg-primary rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                                <Mail size={32} />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                                Unlock Exclusive Deals
                            </h2>
                            <p className="text-orange-50 text-lg md:text-xl font-medium">
                                Join 50,000+ foodies. Get secret menu items, free delivery codes, and week-end deals delivered to your inbox.
                            </p>

                            <div className="bg-white p-2 rounded-3xl sm:rounded-full shadow-lg max-w-lg mx-auto flex flex-col sm:flex-row gap-2 mt-8">
                                <Input
                                    placeholder="Enter your email address..."
                                    className="border-none shadow-none focus-visible:ring-0 text-gray-700 bg-transparent h-12 px-6 text-base flex-1 w-full"
                                />
                                <Button size="lg" className="rounded-full h-12 px-8 bg-gray-900 text-white hover:bg-gray-800 font-bold transition-transform active:scale-95 w-full sm:w-auto">
                                    Subscribe
                                </Button>
                            </div>
                            <div className="text-center pt-4">
                                <p className="text-white/60 text-xs">No spam, just ham (and other delicious things). Unsubscribe anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ----------- 10. Footer ----------- */}
            <Footer />
        </div>
    );
};

export default LandingPage;
