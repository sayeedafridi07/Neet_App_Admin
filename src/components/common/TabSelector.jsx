import React from "react";
import { motion } from "framer-motion";

function TabSelector({ options, selectedTab, onTabChange }) {
  return (
    <div className="flex flex-row items-center">
      {options?.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className="cursor-pointer relative whitespace-nowrap py-3 px-6 font-medium text-sm font-poppins rounded-t-2xl"
          >
            <span
              className={`relative z-10 ${
                selectedTab === index
                  ? "text-primary"
                  : "text-textMuted hover:text-textSecondary"
              }`}
            >
              {item?.title}
            </span>

            {/* Combined background and border animation */}
            {selectedTab === index && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-primary/10 rounded-t-2xl border-b-2 border-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}

            {/* Static border for inactive tabs */}
            <div
              className={`absolute bottom-0 left-0 right-0 border-b-2 border-border ${
                selectedTab === index ? "opacity-0" : "opacity-100"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default TabSelector;
