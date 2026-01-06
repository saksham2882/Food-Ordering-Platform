import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden">
            {/* ---------------- Left Side -------------*/}
            <div className="hidden lg:flex flex-col relative bg-zinc-900 text-white dark:border-r h-full">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                <div className="relative z-20 flex items-center text-lg font-medium p-8">
                    <img src="/logo.svg" alt="Logo" className="w-10 h-10 mr-2" onError={(e) => e.target.style.display = 'none'} />
                    <span className="text-2xl font-bold tracking-tight">FoodXpress</span>
                </div>

                <div className="relative z-20 mt-auto p-12">
                    <Card className="bg-zinc-900/50 backdrop-blur border-zinc-800 text-white max-w-md">
                        <CardContent className="pt-6">
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;FoodXpress has completely transformed how I enjoy food. The quality is consistently top-notch, and every meal arrives fresh, delicious, and perfectly prepared!&rdquo;
                                </p>
                                <footer className="text-sm mt-4 flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">Mr. Gupta</div>
                                        <div className="text-zinc-400 text-xs">Food Critic</div>
                                    </div>
                                    <div className="ml-auto">
                                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">Verified User</Badge>
                                    </div>
                                </footer>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ---------------- Right Side----------------*/}
            <div className="h-full overflow-y-auto bg-background">
                <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
