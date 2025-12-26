import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* ------------ Branding ------------ */}
          <div className="space-y-4">
            <img src="/logo.svg" alt="FoodXpress" width={160} height={160} />
            <p className="text-gray-400 leading-relaxed">
              Delivering happiness to your doorstep. The best local restaurants, fresh ingredients, and lightning-fast delivery.
            </p>

            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* ------------ Quick Links ------------ */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Our Menu</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Restaurants</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* ------------ Legal ------------ */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* ------------ Newsletter & Contact ------------ */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-gray-400">Subscribe for the latest updates and exclusive offers.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
              />
              <Button size="icon" className="bg-primary hover:bg-hover shrink-0">
                <Mail size={18} />
              </Button>
            </div>
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} className="text-primary" />
                <span>321 Food Street, Noida, U.P, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} className="text-primary" />
                <span>+91 9876543210</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800 my-8" />

        {/* ------------ Footer Bottom ------------ */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>Copyright &copy; {new Date().getFullYear()} FoodXpress. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>

        <Separator className="bg-gray-800/30 my-8" />

        <div className="flex flex-col md:flex-row justify-center items-center text-sm text-slate-500">
          created by {" "}
          <a
            href={'https://saksham-agrahari.vercel.app'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center justify-center ml-1 hover:text-cyan-400 hover:underline underline-offset-2"
          >
            <ExternalLink size={14} /> Saksham Agrahari
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
