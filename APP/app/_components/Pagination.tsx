"use client";

import React from "react";
import { useQueryState, parseAsInteger } from "nuqs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  className = "",
}) => {
  const BASE_API_URL = process.env.BASE_API_URL;
  console.log("BASE_API_URL in Pagination (a client component):", BASE_API_URL);
  console.log(
    "NEXT_PUBLIC_BASE_API_URL in Pagination (a client component):",
    process.env.NEXT_PUBLIC_BASE_API_URL
  );

  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrev = () => {
    if (!isFirstPage) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      setPage(currentPage + 1);
    }
  };

  return (
    <div className={`w-full flex justify-center mb-6 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center w-full max-w-2xl">
        <button
          onClick={handlePrev}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={isFirstPage}
        >
          Prethodna
        </button>

        <p className="text-gray-700 text-sm sm:text-base">
          Stranica{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> od{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </p>

        <button
          onClick={handleNext}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={isLastPage}
        >
          Sljedeća
        </button>
      </div>
    </div>
  );
};
