import { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import { NavBar } from "@/components/layout/NavBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Globe, 
  Headphones, 
  CreditCard,
  TrendingUp,
  Building2,
  PiggyBank,
  Shield,
  ArrowRight,
  Wallet,
  Lock,
  Smartphone,
  ArrowLeft
} from "lucide-react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import heroImage from "@/assets/img-2.webp";
import { ZigZagCarousel } from "@/components/ui/zigzag-carousel";

const HERO_IMAGE = heroImage;

// Counter Animation Hook
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return { count, ref };
};

export const LandingPage = () => {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Counter values
  const customers = useCounter(2500000);
  const branches = useCounter(150);
  const assets = useCounter(500);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* --- Header --- */}
      <NavBar />

      {/* --- Hero Section --- */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-white overflow-hidden -mt-10">
        <div className="grid lg:grid-cols-2 h-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
          {/* Left Column - Content with Solid Background */}
          <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white flex items-center pt-8 pb-12 lg:pt-12 lg:pb-16 px-6 md:px-8 lg:px-12 xl:px-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl space-y-6 md:space-y-8"
            >
              {/* Headline - Dark Blue */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-blue-900 leading-[1.1] tracking-tight"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`hero-title-${language}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="block"
                  >
                    {t.hero.title}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`hero-title-highlight-${language}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="block"
                  >
                    {t.hero.titleHighlight}
                  </motion.span>
                </AnimatePresence>
              </motion.h1>

              {/* Subheading - Gray */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed font-normal"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`hero-subtitle-${language}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                  >
                    {t.hero.subtitle}
                  </motion.span>
                </AnimatePresence>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 pt-2"
              >
                {/* Primary CTA - Orange Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      className="bg-nmb-orange hover:bg-nmb-orange/90 text-white px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`hero-cta-primary-${language}`}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                        >
                          {t.hero.ctaPrimary}
                        </motion.span>
                      </AnimatePresence>
                    </Button>
                  </Link>
                </motion.div>

                {/* Secondary CTA - Text Link */}
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.a
                      key={`hero-cta-secondary-${language}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                      href="#about"
                      className="text-blue-900 hover:text-blue-800 font-semibold text-base md:text-lg transition-colors duration-200 flex items-center gap-2 group"
                    >
                      {t.hero.ctaSecondary}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">»</span>
                    </motion.a>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Full Quality Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-[400px] lg:min-h-full overflow-hidden"
          >
            <img
              src={HERO_IMAGE}
              alt="Professional office environment with two professionals collaborating at a desk with MacBook"
              className="w-full h-full object-cover object-center"
              style={{ filter: 'none' }}
            />
          </motion.div>
        </div>
      </section>

      {/* --- Trust Bar Section --- */}
      <div className="bg-nmb-maroon text-white py-10">
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            ref={customers.ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold font-heading mb-1">
              {customers.count.toLocaleString()}+
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`trust-customers-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/80"
              >
                {t.trustBar.customers}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div
            ref={branches.ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold font-heading mb-1">
              {branches.count}+
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`trust-branches-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/80"
              >
                {t.trustBar.branches}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div
            ref={assets.ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold font-heading mb-1">
              ₽{assets.count}Б+
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`trust-assets-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/80"
              >
                {t.trustBar.assets}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold font-heading mb-1">
              25+
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`trust-years-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-white/80"
              >
                {t.trustBar.years}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* --- Zig Zag Carousel Section --- */}
      <ZigZagCarousel id="services" autoplay={true} autoplayInterval={5000} />

      {/* --- Services Grid --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <AnimatePresence mode="wait">
              <motion.h2
                key={`services-title-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
              >
                {t.services.title}
              </motion.h2>
            </AnimatePresence>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: CreditCard, label: t.services.cards },
              { icon: TrendingUp, label: t.services.loans },
              { icon: Building2, label: t.services.investments },
              { icon: PiggyBank, label: t.services.deposits },
              { icon: Shield, label: t.services.insurance },
              { icon: Wallet, label: t.services.wealth },
            ].map((service, idx) => {
              // Simplified animations for reduced motion preference
              const hoverAnimation = shouldReduceMotion 
                ? { scale: 1.02, y: -2 }
                : { scale: 1.08, y: -4, rotate: 2 };
              
              const tapAnimation = shouldReduceMotion
                ? { scale: 1.01 }
                : { scale: 1.05, y: -2 };
              
              const iconHoverAnimation = shouldReduceMotion
                ? { scale: 1.05 }
                : { scale: 1.1, rotate: -2 };
              
              const transitionDuration = shouldReduceMotion ? 0.15 : 0.3;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: shouldReduceMotion ? 0 : idx * 0.05, 
                    duration: transitionDuration, 
                    ease: "easeOut" 
                  }}
                  whileHover={hoverAnimation}
                  whileTap={tapAnimation}
                  className="service-card bg-white rounded-lg p-6 text-center cursor-pointer border border-gray-200 hover:border-nmb-maroon relative overflow-hidden group"
                >
                  {/* Background glow effect on hover */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-nmb-maroon/5 via-transparent to-nmb-blue/5 opacity-0 rounded-lg"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: transitionDuration, ease: "easeOut" }}
                      style={{ filter: "blur(8px)" }}
                    />
                  )}
                  
                  {/* Icon container with background circle and glow */}
                  <motion.div
                    className="relative mx-auto mb-3 w-16 h-16 flex items-center justify-center"
                    whileHover={iconHoverAnimation}
                    transition={{ duration: transitionDuration, ease: "easeOut" }}
                  >
                    {/* Background circle with soft glow */}
                    {!shouldReduceMotion && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100"
                        whileHover={{
                          scale: 1.2,
                          opacity: 1,
                          transition: { duration: transitionDuration, ease: "easeOut" }
                        }}
                        style={{
                          filter: "blur(4px)",
                          boxShadow: "0 0 20px rgba(138, 18, 0, 0.1)"
                        }}
                      />
                    )}
                    
                    {/* Icon with enhanced size */}
                    <service.icon 
                      className="h-10 w-10 text-gray-700 relative z-10 transition-colors duration-300 group-hover:text-nmb-maroon" 
                    />
                  </motion.div>
                  
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`service-${idx}-${language}`}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                      className="text-sm font-medium text-gray-700 relative z-10"
                    >
                      {service.label}
                    </motion.p>
                  </AnimatePresence>
                  
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.h2
                key={`cta-title-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
              >
                {t.cta.title}
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`cta-subtitle-${language}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto"
              >
                {t.cta.subtitle}
              </motion.p>
            </AnimatePresence>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-nmb-orange hover:bg-nmb-orange/90 text-white px-10 py-6 text-base"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`cta-button-${language}`}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      {t.cta.button}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <Footer />
    </div>
  );
};
