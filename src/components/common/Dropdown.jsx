import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  Calendar,
  Users,
  Loader2,
  X,
  Check,
} from "lucide-react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Image from "./Image";
import CheckBox from "./CheckBox";

const Dropdown = ({
  data = [],
  placeholder = "Select an option",
  label = "",
  searchable = false,
  icon: Icon = null,
  onSelect = () => {},
  maxHeight = "300px",
  value = null,
  disabled = false,
  loading = false,
  error = "",
  isMandatory = false,
  multiSelect = false, // <-- Add this prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(multiSelect ? [] : null); // <-- Support array for multiSelect
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownDirection, setDropdownDirection] = useState("down"); // "down" or "up"
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Sync selectedItem with value prop
  useEffect(() => {
    if (multiSelect) {
      if (Array.isArray(value)) {
        const foundItems = data.filter(
          (item) =>
            value.includes(item.id) ||
            value.includes(item.value) ||
            value.includes(item.label),
        );
        setSelectedItem(foundItems);
      } else {
        setSelectedItem([]);
      }
    } else {
      if (value !== null && value !== undefined) {
        // Find the item in data that matches the value (by id or value)
        const found = data.find(
          (item) =>
            item.id === value || item.value === value || item.label === value,
        );
        setSelectedItem(found || null);
      } else {
        setSelectedItem(null);
      }
    }
  }, [value, data, multiSelect]);

  // Use the custom hook to close dropdown on outside click
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Dynamically decide dropdown direction on open
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const dropdownHeight = 300; // px, max height
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
    }
  }, [isOpen]);

  const filteredData = data.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSelect = (item) => {
    if (multiSelect) {
      setSelectedItem((prev) => {
        const exists = prev.some(
          (selected) =>
            selected.id === item.id || selected.label === item.label,
        );
        let updated;
        if (exists) {
          updated = prev.filter(
            (selected) =>
              selected.id !== item.id && selected.label !== item.label,
          );
        } else {
          updated = [...prev, item];
        }
        onSelect(updated);
        return updated;
      });
    } else {
      setSelectedItem(item);
      setIsOpen(false);
      setSearchTerm("");
      onSelect(item);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {isMandatory && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div
        className={`relative rounded-xl border bg-white transition-all duration-200 ${
          isOpen
            ? error
              ? "border-red-500 shadow-lg"
              : "border-primary shadow-lg"
            : error
              ? "border-red-500 shadow-sm"
              : "border-gray-200 shadow-sm hover:border-gray-300"
        } ${
          disabled
            ? "cursor-not-allowed opacity-60 select-none"
            : "cursor-pointer "
        }`}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || loading}
        ref={triggerRef}
      >
        <div className="flex items-center px-4 py-3">
          {Icon && <Icon className="mr-3 size-3 text-gray-500" />}

          <div className="min-w-0 flex-1">
            {multiSelect ? (
              selectedItem.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedItem.map((item) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(item);
                      }}
                      key={item.id || item.value || item.label}
                      className="text-primary flex items-center rounded-full bg-sky-50 px-2 py-1 text-xs"
                    >
                      {item.label}
                      <span className="text-primary ml-1 text-xs">
                        <X className="size-3" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500">{placeholder}</span>
              )
            ) : selectedItem ? (
              <div className="flex items-center">
                {selectedItem.image && (
                  <Image
                    source={selectedItem.image}
                    alt={selectedItem.label}
                    className="mr-3 h-6 w-6 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="truncate text-sm font-medium text-gray-900">
                    {selectedItem.label}
                  </div>
                  {selectedItem.description && (
                    <div className="truncate text-xs text-gray-500">
                      {selectedItem.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-500">{placeholder}</span>
            )}
          </div>

          {/* Show loading spinner if loading */}
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin text-gray-500" />
          ) : (
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      {error && <p className="mt-1 ml-1 text-xs text-red-500">{error}</p>}

      {isOpen && !loading && (
        <div
          className={`absolute right-0 left-0 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ${
            dropdownDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"
          } `}
          style={{ maxHeight: maxHeight }}
        >
          {searchable && (
            <div className="border-b border-gray-100 p-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary w-full rounded-lg border border-gray-200 py-2 pr-3 pl-10 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                  disabled={disabled || loading}
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                return (
                  <div
                    key={item.id || index}
                    className={`flex cursor-pointer items-center px-4 py-3 transition-colors duration-150 hover:bg-gray-50 ${
                      multiSelect &&
                      selectedItem.some(
                        (selected) =>
                          selected.id === item.id ||
                          (selected.value &&
                            item.value &&
                            selected.value === item.value) ||
                          selected.label === item.label,
                      )
                        ? "bg-sky-50"
                        : ""
                    }`}
                    onClick={() => !disabled && !loading && handleSelect(item)}
                  >
                    {multiSelect && (
                      <div className="mr-2">
                        <CheckBox
                          checked={selectedItem.some(
                            (selected) =>
                              selected.id === item.id ||
                              (selected.value &&
                                item.value &&
                                selected.value === item.value) ||
                              selected.label === item.label,
                          )}
                          disabled={disabled || loading}
                        />
                      </div>
                    )}
                    {item.image && (
                      <Image
                        source={item.image}
                        alt={item.label}
                        className="mr-3 h-8 w-8 rounded-full border border-gray-200 object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="mt-1 truncate text-xs text-gray-500">
                          {item.description}
                        </div>
                      )}
                      {item.badge && (
                        <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-800">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {item.meta && (
                      <div className="ml-2 text-xs text-gray-400">
                        {item.meta}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

// // Demo component
// const App = () => {
//   const locationData = [
//     {
//       id: 1,
//       label: "New York, NY",
//       description: "United States",
//       image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=50&h=50&fit=crop&crop=center",
//       badge: "Popular",
//       meta: "2.5M stays"
//     },
//     {
//       id: 2,
//       label: "Paris, France",
//       description: "Europe",
//       image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=50&h=50&fit=crop&crop=center",
//       meta: "1.8M stays"
//     },
//     {
//       id: 3,
//       label: "Tokyo, Japan",
//       description: "Asia",
//       image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=50&h=50&fit=crop&crop=center",
//       meta: "950K stays"
//     },
//     {
//       id: 4,
//       label: "London, UK",
//       description: "Europe",
//       image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=50&h=50&fit=crop&crop=center",
//       badge: "Trending",
//       meta: "1.2M stays"
//     },
//     {
//       id: 5,
//       label: "Barcelona, Spain",
//       description: "Europe",
//       image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=50&h=50&fit=crop&crop=center",
//       meta: "680K stays"
//     }
//   ];

//   const guestData = [
//     {
//       id: 1,
//       label: "1 Guest",
//       description: "Single traveler"
//     },
//     {
//       id: 2,
//       label: "2 Guests",
//       description: "Couple or friends"
//     },
//     {
//       id: 3,
//       label: "3 Guests",
//       description: "Small group"
//     },
//     {
//       id: 4,
//       label: "4+ Guests",
//       description: "Large group"
//     }
//   ];

//   const handleLocationSelect = (location) => {
//     console.log('Selected location:', location);
//   };

//   const handleGuestSelect = (guest) => {
//     console.log('Selected guest count:', guest);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//           Airbnb-style Dropdown Components
//         </h1>

//         <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">
//             Search Your Next Stay
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <Dropdown
//               data={locationData}
//               placeholder="Where are you going?"
//               label="Destination"
//               searchable={true}
//               icon={MapPin}
//               onSelect={handleLocationSelect}
//             />

//             <Dropdown
//               data={[
//                 { id: 1, label: "Check-in", description: "Add dates" },
//                 { id: 2, label: "Check-out", description: "Add dates" }
//               ]}
//               placeholder="Add dates"
//               label="When"
//               icon={Calendar}
//             />

//             <Dropdown
//               data={guestData}
//               placeholder="Add guests"
//               label="Who"
//               icon={Users}
//               onSelect={handleGuestSelect}
//             />
//           </div>

//           <button className="w-full md:w-auto mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200">
//             Search
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm p-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">
//             Features
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-3">
//               <h3 className="font-medium text-gray-900">✨ Key Features</h3>
//               <ul className="text-sm text-gray-600 space-y-2">
//                 <li>• Fully responsive design</li>
//                 <li>• Image support for options</li>
//                 <li>• Search functionality</li>
//                 <li>• Custom icons</li>
//                 <li>• Badges and metadata</li>
//                 <li>• Smooth animations</li>
//               </ul>
//             </div>

//             <div className="space-y-3">
//               <h3 className="font-medium text-gray-900">🎨 Customizable</h3>
//               <ul className="text-sm text-gray-600 space-y-2">
//                 <li>• Pass custom data arrays</li>
//                 <li>• Configurable placeholder text</li>
//                 <li>• Optional search feature</li>
//                 <li>• Custom selection callbacks</li>
//                 <li>• Flexible styling options</li>
//                 <li>• Mobile-first approach</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
