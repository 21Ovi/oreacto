import { useCallback, useEffect, useRef, useState } from "react";

type UseInfiniteScrollProps = {
  fetchData: (page: number) => void;
  hasMoreData: boolean;
};

type UseInfiniteScrollResult = {
  loader: React.MutableRefObject<HTMLDivElement | null>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * A custom hook for implementing infinite scrolling functionality.
 *
 * @param {function} fetchData - Function to fetch data for a given page number.
 * @param {boolean} hasMoreData - Boolean indicating if there is more data to load.
 * @returns {object} - Returns `loader` (ref for the intersection observer), `page` (current page), and `setPage` (function to manually set the page).
 *
 * @example
 * const { loader, page, setPage } = useInfiniteScroll({
 *   fetchData: (page) => fetchMoreData(page),
 *   hasMoreData: true,
 * });
 *
 * <div ref={loader}></div> // Place this div at the end of the scrollable content
 */
const useInfiniteScroll = ({
  fetchData,
  hasMoreData,
}: UseInfiniteScrollProps): UseInfiniteScrollResult => {
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreData) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMoreData]
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  return { loader, page, setPage };
};

export default useInfiniteScroll;
