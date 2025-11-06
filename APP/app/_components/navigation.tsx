"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = {
  title: string;
  path: `/${string}`;
};

const pages: Page[] = [
  { title: "Početna", path: "/" },
  { title: "Mreže za vas", path: "/mreze" },
  { title: "Pomoć", path: "/help" },
  { title: "Moj račun", path: "/racun" },
  { title: "O nama", path: "/info" },
];

function processPage(page: Page, index: number, currentPath?: string) {
  const isActive =
    page.path === "/"
      ? currentPath === page.path
      : currentPath?.startsWith(page.path);

  return (
    <li key={index} className="relative group">
      <Link
        href={page.path}
        className={`px-4 py-2 rounded-lg transition-all duration-200 flex flex-col items-center rounded-2xl shadow hover:shadow-lg transition${
          isActive
            ? "font-extrabold bg-[#4CAF82] text-white"
            : "hover:text-black text-gray-700"
        } hover:scale-105`}
      >
        {page.title}
        {isActive && (
          <div className="absolute -bottom-3 left-0 right-0 mx-auto w-0 h-0
            border-l-[10px] border-l-transparent
            border-r-[10px] border-r-transparent
            border-b-[10px] border-b-black">
          </div>
        )}
      </Link>
    </li>
  );
}

export function Navigation() {
  const currentPath = usePathname();
  return (
    <nav>
      <ul className="flex space-x-2 pr-6 ">
        {pages.map((page, index) => processPage(page, index, currentPath))}
      </ul>
    </nav>
  );
}