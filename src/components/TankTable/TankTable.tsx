import { useCallback, useMemo, useState, FC, KeyboardEvent, ChangeEvent } from 'react';
import { Vehicle } from '../../services/vehiclesService';
import { useVehicles } from '../../hooks/useVehicles';
import { usePagination } from '../../hooks/usePagination';
import { normalizeSearchString } from '../../utils/stringNormalize';
import { TankTableControls } from './TankTableControls';
import { TankTableContent } from './TankTableContent';
import { TankTablePagination } from './TankTablePagination';
import { DEFAULT_PAGE_SIZE } from './TankTable.constants';
import './TankTable.scss';

/**
 * Paginated table of tanks with two filter modes:
 * - **Page filter** — hides rows on the current page by substring (diacritics-aware).
 * - **Exact-name search** — finds a tank in the full dataset and jumps to its page.
 *
 * @returns Rendered tank table element.
 */
export const TankTable: FC = () => {
  const { vehicles, isLoading, isError, retry } = useVehicles();
  const [pageFilter, setPageFilter] = useState('');
  const [exactQuery, setExactQuery] = useState('');
  const [exactNotFound, setExactNotFound] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const {
    page,
    pageSize,
    totalPages,
    pageItems,
    setPage,
    setPageSize,
  } = usePagination<Vehicle>(vehicles, DEFAULT_PAGE_SIZE);

  const filteredPageItems = useMemo(() => {
    const normalizedFilter = normalizeSearchString(pageFilter);
    if (!normalizedFilter) return pageItems;
    return pageItems.filter((vehicle) =>
      normalizeSearchString(vehicle.name).includes(normalizedFilter)
    );
  }, [pageItems, pageFilter]);

  const handleExactSearch = useCallback(() => {
    setExactNotFound(false);
    const normalizedQuery = normalizeSearchString(exactQuery.trim());
    if (!normalizedQuery || !vehicles.length) return;

    const index = vehicles.findIndex(
      (vehicle) => normalizeSearchString(vehicle.name) === normalizedQuery
    );

    if (index === -1) {
      setExactNotFound(true);
      setHighlightedId(null);
      return;
    }

    setHighlightedId(vehicles[index].tank_id);
    setPage(Math.floor(index / pageSize) + 1);
  }, [exactQuery, vehicles, setPage, pageSize]);

  const handlePageFilterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPageFilter(e.target.value);
  }, []);

  const handleExactQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setExactQuery(e.target.value);
    setExactNotFound(false);
    setHighlightedId(null);
  }, []);

  const handleExactQueryKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleExactSearch();
  }, [handleExactSearch]);

  const handlePageSizeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  }, [setPageSize]);

  const handlePrev = useCallback(() => {
    setPage(page - 1);
  }, [setPage, page]);

  const handleNext = useCallback(() => {
    setPage(page + 1);
  }, [setPage, page]);

  if (isError) {
    return (
      <div className="tank-table">
        <div className="tank-table__error" role="alert">
          <p className="tank-table__error-message">Failed to load vehicles.</p>
          <button
            type="button"
            className="tank-table__error-retry"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tank-table">
      <TankTableControls
        pageFilter={pageFilter}
        exactQuery={exactQuery}
        exactNotFound={exactNotFound}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageFilterChange={handlePageFilterChange}
        onExactQueryChange={handleExactQueryChange}
        onExactQueryKeyDown={handleExactQueryKeyDown}
        onExactSearch={handleExactSearch}
        onPageSizeChange={handlePageSizeChange}
      />

      <TankTableContent
        vehicles={filteredPageItems}
        isLoading={isLoading}
        highlightedId={highlightedId}
      />

      <TankTablePagination
        page={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
        onPageChange={setPage}
      />
    </div>
  );
};
