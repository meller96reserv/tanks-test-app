import { memo, FC, useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';

interface TankTablePaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
}

/** Renders Previous / page-input / Next pagination controls. Returns null when only one page exists. */
export const TankTablePagination: FC<TankTablePaginationProps> = memo(({
  page,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
}) => {
  const [inputValue, setInputValue] = useState(String(page));

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  if (totalPages <= 1) return null;

  const commit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.min(Math.max(parsed, 1), totalPages);
      setInputValue(String(clamped));
      onPageChange(clamped);
    } else {
      setInputValue(String(page));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/^\d*$/.test(raw)) setInputValue(raw);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
  };

  return (
    <div className="tank-table__pagination" role="navigation" aria-label="Pagination">
      <button
        type="button"
        className="tank-table__pagination-button"
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </button>

      <span className="tank-table__pagination-info" aria-live="polite">
        Page{' '}
        <input
          className="tank-table__pagination-input"
          type="number"
          min={1}
          max={totalPages}
          value={inputValue}
          onChange={handleChange}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="Page number"
        />
        {' '}of {totalPages}
      </span>

      <button
        type="button"
        className="tank-table__pagination-button"
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
});
