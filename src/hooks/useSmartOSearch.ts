import { useState, useMemo } from "react";
import _ from "lodash";

type useSmartOSearchProps<T> = {
  items: T[];
  filterKeys?: (keyof T)[];
  searchQuery?: string;
  sortKey?: keyof T;
  sortOrder?: "asc" | "desc";
};

type useSmartOSearchResult<T> = {
  filteredItems: T[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * A custom hook that filters and sorts a list of items based on a search query and specified filter keys.
 *
 * @template T - The type of items in the list.
 * @param {useSmartOSearchProps<T>} params - The parameters for the hook.
 * @param {T[]} params.items - The list of items to filter and sort.
 * @param {(keyof T)[]} [params.filterKeys=[]] - Keys of the items to apply the search filter.
 * @param {string} [params.searchQuery=''] - The initial search query.
 * @param {keyof T} [params.sortKey='name'] - The key to sort the items by.
 * @param {'asc' | 'desc'} [params.sortOrder='asc'] - The order to sort the items.
 * @returns {useSmartOSearchResult<T>} - The filtered and sorted items, the query state, and the function to update the query.
 *
 * @example
 * // Usage example
 * const { filteredItems, query, setQuery } = useSmartOSearch({
 *   items: users,
 *   filterKeys: ['name', 'email'],
 *   searchQuery: '',
 *   sortKey: 'name',
 *   sortOrder: 'asc',
 * });
 *
 * // Update the search query
 * setQuery('John');
 */
const useSmartOSearch = <T>({
  items,
  filterKeys = [],
  searchQuery = "",
  sortKey = "name" as keyof T,
  sortOrder = "asc",
}: useSmartOSearchProps<T>): useSmartOSearchResult<T> => {
  const [query, setQuery] = useState(searchQuery);

  const filteredItems = useMemo(
    () =>
      _.chain(items)
        .filter((item: any) =>
          filterKeys.some((key) =>
            _.includes(_.toLower(item[key]?.toString()), _.toLower(query))
          )
        )
        .orderBy([sortKey], [sortOrder])
        .value(),
    [items, filterKeys, query, sortKey, sortOrder]
  );

  return { filteredItems, query, setQuery };
};

export default useSmartOSearch;
