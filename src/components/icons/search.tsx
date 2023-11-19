export function SearchIcon() {
  return (
    <span
      className="input-group-text flex items-center whitespace-nowrap rounded py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
      id="search-icon"
    >
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        name="search icon"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}
