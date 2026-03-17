"use client";

import * as React from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface MenuBarItem {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  label: string;
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuBarItem[];
  onAction?: (label: string) => void;
}

const springConfig = {
  duration: 0.3,
  ease: easeInOut,
};

const NAV_ROUTES: Record<string, string> = {
  Home: "/",
  Work: "/work",
  About: "/about",
  Contact: "/contact",
};

export function MenuBar({ items, className, onAction, ...props }: MenuBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState({
    left: 0,
    width: 0,
  });
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const menuItemIndex = items.findIndex((item) => item.label === "Menu");

  React.useEffect(() => {
    if (activeIndex !== null && menuRef.current && tooltipRef.current) {
      const menuItem = menuRef.current.children[activeIndex] as HTMLElement;
      const menuRect = menuRef.current.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const left =
        itemRect.left -
        menuRect.left +
        (itemRect.width - tooltipRect.width) / 2;

      setTooltipPosition({
        left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width)),
        width: tooltipRect.width,
      });
    }
  }, [activeIndex]);

  // Auto-close menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleItemClick = (index: number) => {
    if (index === menuItemIndex) {
      setMenuOpen((prev) => !prev);
      return;
    }
    onAction?.(items[index].label);
  };

  const handleNavClick = (label: string) => {
    setMenuOpen(false);
    const route = NAV_ROUTES[label];
    if (route) navigate(route);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      {/* Tooltip */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={springConfig}
            className="absolute left-0 right-0 -top-[31px] pointer-events-none z-50"
          >
            <motion.div
              ref={tooltipRef}
              className={cn(
                "h-7 px-3 rounded-lg inline-flex justify-center items-center overflow-hidden",
                "bg-white/5 backdrop-blur-md",
                "border border-white/10",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              )}
              initial={{ x: tooltipPosition.left }}
              animate={{ x: tooltipPosition.left }}
              transition={springConfig}
              style={{ width: "auto" }}
            >
              <p className="text-[13px] font-medium leading-tight whitespace-nowrap text-white">
                {activeIndex === menuItemIndex && menuOpen
                  ? "Close Menu"
                  : items[activeIndex].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu bar */}
      <div
        ref={menuRef}
        className={cn(
          "h-10 px-1.5 inline-flex justify-center items-center gap-0.75 overflow-hidden z-10",
          "rounded-full bg-white/5 backdrop-blur-md",
          "border border-white/10",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_16px_-4px_rgba(0,0,0,0.3)]"
        )}
      >
        {items.map((item, index) => {
          const isHamburger = index === menuItemIndex;
          return (
            <button
              key={index}
              className="w-8 h-8 px-3 py-1 rounded-full flex justify-center items-center gap-2 hover:bg-white/10 transition-colors text-white"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => handleItemClick(index)}
            >
              <div className="flex justify-center items-center">
                <div className="w-[18px] h-[18px] flex justify-center items-center overflow-hidden">
                  {isHamburger ? (
                    <motion.div
                      animate={
                        menuOpen
                          ? { rotate: 90, opacity: 0.6 }
                          : { rotate: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <item.icon className="w-full h-full stroke-white" />
                    </motion.div>
                  ) : (
                    <item.icon className="w-full h-full stroke-white" />
                  )}
                </div>
              </div>
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown nav panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className={cn(
              "absolute top-[calc(100%+10px)] right-0 z-50 min-w-[160px]",
              "rounded-xl bg-white/5 backdrop-blur-md",
              "border border-white/10",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_32px_-4px_rgba(0,0,0,0.5)]",
              "overflow-hidden"
            )}
          >
            {Object.entries(NAV_ROUTES).map(([label, route], i) => {
              const isActive = location.pathname === route;
              return (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.18, ease: "easeOut" }}
                  onClick={() => handleNavClick(label)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-[12px] font-mono tracking-widest uppercase transition-colors",
                    "flex items-center justify-between gap-3",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-white/60 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}