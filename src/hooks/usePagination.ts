import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationResult<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  pageItems: T[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

/**
 * Generic pagination hook.
 *
 * The returned `page` is always clamped to `[1, totalPages]`,
 * even if `setPage` is called with an out-of-range value.
 *
 * @param items - Full collection to paginate.
 * @param initialPageSize - Defaults to `10`.
 */
export function usePagination<T>(
  items: T[],
  initialPageSize = 10
): UsePaginationResult<T> {
  const [rawPage, setRawPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  const page = useMemo(
    () => Math.min(Math.max(rawPage, 1), totalPages),
    [rawPage, totalPages]
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setRawPage(1);
  }, []);

  return {
    page,
    pageSize,
    totalPages,
    pageItems,
    setPage: setRawPage,
    setPageSize: handleSetPageSize,
  };
}
