import React from "react";

const TitleBar = ({ onSearchChange }) => {
    return (
        <div className="flex justify-between items-center p-3 lg:px-8 bg-gtgold w-full">
            <div className="flex items-center">
                <img
                    src={'gt-logo.png'} // Reference the logo from the public folder
                    alt="Georgia Tech Logo"
                    className="h-11 mr-4" // Adjust size and spacing as needed
                />
                <h1 className="text-3xl font-semibold text-white">Open Source Projects</h1>
            </div>

            {/* Search Bar */}
            <div className="flex w-1/3">
                <input
                    type="text"
                    placeholder="Search project by name..."
                    className="w-full rounded-l-md border-0 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
                    onChange={onSearchChange}
                />
                <div className="bg-gtgolddark rounded-r-md px-3 py-2 flex items-center">
                    <svg
                        className="w-7 h-7 text-white"
                        xlmns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
};

export default TitleBar;