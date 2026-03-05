import { FC, ChangeEvent, KeyboardEvent } from 'react';
import { PAGE_SIZE_OPTIONS } from './TankTable.constants';

interface TankTableControlsProps {
  pageFilter: string;
  exactQuery: string;
  exactNotFound: boolean;
  pageSize: number;
  isLoading: boolean;
  onPageFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onExactQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onExactQueryKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onExactSearch: () => void;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

/** Renders the filter, exact-search and page-size controls bar. */
export const TankTableControls: FC<TankTableControlsProps> = ({
  pageFilter,
  exactQuery,
  exactNotFound,
  pageSize,
  isLoading,
  onPageFilterChange,
  onExactQueryChange,
  onExactQueryKeyDown,
  onExactSearch,
  onPageSizeChange,
}) => (
  <div className="tank-table__controls">
    <div className="tank-table__filter-group">
      <label className="tank-table__filter">
        <span className="tank-table__filter-label">Filter on page:</span>
        <input
          type="text"
          className="tank-table__filter-input"
          placeholder="Filter tanks on current page…"
          value={pageFilter}
          onChange={onPageFilterChange}
        />
      </label>

      <div className="tank-table__exact-search">
        <label
          htmlFor="exact-search-input"
          className="tank-table__exact-search-label"
        >
          Find by full name:
        </label>
        <div className="tank-table__exact-search-controls">
          <input
            id="exact-search-input"
            type="text"
            className={[
              'tank-table__exact-search-input',
              exactNotFound ? 'tank-table__exact-search-input--error' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            placeholder="Full tank name (e.g. T-34)"
            value={exactQuery}
            onChange={onExactQueryChange}
            onKeyDown={onExactQueryKeyDown}
            disabled={isLoading}
          />
          <button
            type="button"
            className="tank-table__exact-search-button"
            onClick={onExactSearch}
            disabled={isLoading}
          >
            Find
          </button>
        </div>
        {exactNotFound && (
          <span role="alert" className="tank-table__exact-search-error">
            Tank not found.
          </span>
        )}
      </div>
    </div>

    <label className="tank-table__page-size">
      <span className="tank-table__page-size-label">Per page:</span>
      <select
        className="tank-table__page-size-select"
        value={pageSize}
        onChange={onPageSizeChange}
        disabled={isLoading}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </label>
  </div>
);
