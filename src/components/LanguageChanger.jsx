import React, { useEffect, useState } from "react";
import LanguagesStore from "../store/LanguagesStore";

export default function LanguageChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const {languages, fetchLanguages, setLanguage, language} = LanguagesStore();
  // const [languages, setLanguages] = useState({});

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchLanguages()
  }, []);

  return (
    <div className="m-2">
      <button
        id="dropdownSearchButton"
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {language}{" "}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="dropdownSearch"
          className="z-10 absolute mt-2 bg-white rounded-lg shadow w-60 dark:bg-gray-700"
        >
          <div className="p-3">
            <label htmlFor="input-group-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="input-group-search"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search user"
              />
            </div>
          </div>
          <ul
            className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {languages &&
              languages.map((languageItem) => (
                <li
                  key={languageItem}
                  className={`py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                    language === languageItem
                      ? "bg-blue-500 hover:bg-blue-700 text-white"
                      : ""
                  }`}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => setLanguage(languageItem)}
                  >
                    {languageItem}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
