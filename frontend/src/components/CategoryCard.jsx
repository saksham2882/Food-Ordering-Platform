import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CategoryCard = ({ name, image, onClick, className }) => {
  return (
    <Card
      className={cn(
        "group relative w-[135px] h-[135px] md:w-[160px] md:h-[160px] shrink-0 overflow-hidden cursor-pointer border-none rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.(e);
        }
      }}
    >
      <div className="absolute inset-0 bg-gray-200">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-3 text-center">
        <span className="text-white text-sm md:text-base font-bold tracking-wide drop-shadow-md group-hover:text-primary-foreground transition-colors">
          {name}
        </span>
      </div>
    </Card>
  );
};

export default CategoryCard;
