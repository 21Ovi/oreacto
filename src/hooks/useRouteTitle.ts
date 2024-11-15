import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * A custom hook that generates a title from the current route path.
 *
 * @returns {string} - A formatted title derived from the last segment of the URL path.
 *
 * @example
 * // Given the URL path '/exercises-management'
 * const title = useRouteTitle();
 * // title will be 'Exercises Management'
 */
const useRouteTitle = (): string => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const lastSegment = pathname.split("/").pop();
    if (!lastSegment) return "";

    // Capitalize each word in the last segment, replacing hyphens with spaces
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [pathname]);
};

export default useRouteTitle;
