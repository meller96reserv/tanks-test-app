import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe('usePagination', () => {
  it('initialises with correct state', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns at least 1 total page for an empty list', () => {
    const { result } = renderHook(() => usePagination([], 10));
    expect(result.current.totalPages).toBe(1);
  });

  it('navigates to a page and returns the correct slice', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => { result.current.setPage(2); });
    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('returns a partial slice on the last page', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => { result.current.setPage(3); });
    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25]);
  });

  it('clamps out-of-range page values', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => { result.current.setPage(999); });
    expect(result.current.page).toBe(3);
    act(() => { result.current.setPage(-5); });
    expect(result.current.page).toBe(1);
  });

  it('changing page size resets to page 1 and recalculates totals', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => { result.current.setPage(3); });
    act(() => { result.current.setPageSize(5); });
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(5);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5]);
  });
});
