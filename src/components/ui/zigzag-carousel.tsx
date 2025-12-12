import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

type ZigZagSection = {
  id: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  points?: string[];
  cta: string;
  ctaVariant: "default" | "outline";
  image: string;
  imageAlt: string;
  layout: "text-left" | "text-right";
};

export const ZigZagCarousel = ({
  autoplay = true,
  autoplayInterval = 5000,
  className,
  id,
}: {
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  id?: string;
}) => {
  const { language, t } = useLanguage();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const sections: ZigZagSection[] = [
    {
      id: "accounts",
      iconBg: "bg-nmb-maroon/10",
      iconColor: "text-nmb-maroon",
      title: t.features.accounts.title,
      description: t.features.accounts.description,
      points: t.features.accounts.points,
      cta: t.features.accounts.cta,
      ctaVariant: "default",
      image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      imageAlt: "Accounts",
      layout: "text-left",
    },
    {
      id: "security",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: t.features.security.title,
      description: t.features.security.description,
      points: t.features.security.points,
      cta: t.features.security.cta,
      ctaVariant: "outline",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      imageAlt: "Security",
      layout: "text-right",
    },
    {
      id: "global",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      title: t.features.global.title,
      description: t.features.global.description,
      cta: t.features.global.cta,
      ctaVariant: "default",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      imageAlt: "Global Access",
      layout: "text-left",
    },
    {
      id: "digital",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      title: t.features.digital.title,
      description: t.features.digital.description,
      cta: t.features.digital.cta,
      ctaVariant: "default",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      imageAlt: "Digital Innovation",
      layout: "text-left",
    },
  ];

  const handleNext = () => {
    setActive((prev) => (prev + 1) % sections.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const goToSlide = (index: number) => {
    setActive(index);
  };

  useEffect(() => {
    if (autoplay && !isPaused) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % sections.length);
      }, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayInterval, sections.length, isPaused]);

  const currentSection = sections[active];

  return (
    <section 
      id={id} 
      className={cn("py-12 md:py-16 bg-white", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Fixed height container to prevent jumping */}
        <div 
          ref={sectionRef}
          className="min-h-[450px] md:min-h-[500px] lg:min-h-[550px] flex items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${language}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full grid lg:grid-cols-[45%_55%] gap-6 md:gap-8 lg:gap-10 items-center"
            >
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className={cn(
                  "flex flex-col justify-center min-h-[350px] py-4 px-2 md:px-4",
                  currentSection.layout === "text-right" && "order-1 lg:order-2"
                )}
              >
                <div className="space-y-4">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gray-900 leading-tight"
                  >
                    {currentSection.title}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-base md:text-lg text-gray-600 leading-relaxed"
                  >
                    {currentSection.description}
                  </motion.p>
                  
                  {currentSection.points && (
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="space-y-3 mt-4"
                    >
                      {currentSection.points.map((point, idx) => (
                        <motion.li
                          key={point}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
                          className="flex items-center gap-3 text-gray-700 text-sm md:text-base"
                        >
                          <div className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                            currentSection.iconBg
                          )}>
                            <CheckCircle2 className={cn("h-4 w-4", currentSection.iconColor)} />
                          </div>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>
                
                {/* Enhanced Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="mt-6"
                >
                  <Button
                    size="default"
                    className={cn(
                      "px-6 py-5 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 shadow-md",
                      currentSection.ctaVariant === "default"
                        ? "bg-nmb-maroon hover:bg-nmb-maroon/90 text-white hover:shadow-lg hover:-translate-y-0.5"
                        : "border-2 border-nmb-maroon text-nmb-maroon hover:bg-nmb-maroon hover:text-white hover:shadow-lg hover:-translate-y-0.5"
                    )}
                    variant={currentSection.ctaVariant === "default" ? "default" : "outline"}
                  >
                    {currentSection.cta}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Image - Fixed aspect ratio and size */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cn(
                  "relative w-full h-[300px] md:h-[350px] lg:h-[400px]",
                  currentSection.layout === "text-right" && "order-2 lg:order-1"
                )}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg group">
                  {/* Image with consistent aspect ratio */}
                  <img
                    src={currentSection.image}
                    alt={currentSection.imageAlt}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Colored overlay/gradient for brand consistency */}
                  <div className="absolute inset-0 bg-gradient-to-br from-nmb-maroon/20 via-transparent to-nmb-blue/10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {/* Previous Button - Moderately sized */}
          <button
            onClick={handlePrev}
            className="h-12 w-12 rounded-full bg-white border-2 border-gray-200 hover:border-nmb-maroon hover:bg-nmb-maroon flex items-center justify-center group/button transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover/button:text-white group-hover/button:translate-x-[-2px] transition-all duration-300" />
          </button>

          {/* Enhanced Dots Indicator */}
          <div className="flex gap-2 items-center">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nmb-maroon focus:ring-offset-2",
                  index === active
                    ? "w-8 h-2.5 bg-nmb-maroon shadow-md"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400 hover:scale-110"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button - Moderately sized */}
          <button
            onClick={handleNext}
            className="h-12 w-12 rounded-full bg-white border-2 border-gray-200 hover:border-nmb-maroon hover:bg-nmb-maroon flex items-center justify-center group/button transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5 text-gray-700 group-hover/button:text-white group-hover/button:translate-x-[2px] transition-all duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
