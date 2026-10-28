import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

function SearchInput({
    onSearch,
    placeholder = "Search...",
    delay = 500,
    resultCount = null,
    className = "",
}) {
    const [input, setInput] = useState("");
    const debouncedValue = useDebounce(input, delay);

    // Fire onSearch whenever debounced value settles
    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]);

    const handleClear = () => {
        setInput("");
        onSearch("");
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full rounded-2xl border border-gray-300 bg-white py-3 pl-10 pr-10 leading-5 placeholder-gray-500 focus:border-primary focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {input && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            onClick={handleClear}
                            className="cursor-pointer rounded-full bg-primary p-0.5 text-white"
                        >
                            <X className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
            {debouncedValue && resultCount !== null && (
                <p className="text-sm text-gray-600">
                    {resultCount} result{resultCount !== 1 ? "s" : ""} found
                </p>
            )}
        </div>
    );
}

export default SearchInput;