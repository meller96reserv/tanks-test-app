import { render, screen, fireEvent } from '@testing-library/react';
import { TankTable } from './TankTable';
import { fetchVehicles } from '../services/vehiclesService';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './TankTable/TankTable.constants';

jest.mock('../services/vehiclesService');

const mockFetch = jest.mocked(fetchVehicles);

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeImages = (id: number) => ({
  small_icon: `https://example.com/small/${id}.png`,
});

const baseVehicles = [
  { tank_id: 1, name: 'Tiger I', nation: 'germany', tier: 7, type: 'heavyTank',  images: makeImages(1) },
  { tank_id: 2, name: 'Löwe',   nation: 'germany', tier: 8, type: 'heavyTank',  images: makeImages(2) },
  { tank_id: 3, name: 'T-34',   nation: 'ussr',    tier: 5, type: 'mediumTank', images: makeImages(3) },
];

// DEFAULT_PAGE_SIZE + 5 items → 2 pages at the default page size
const manyVehicles = Array.from({ length: DEFAULT_PAGE_SIZE + 5 }, (_, i) => ({
  tank_id: i + 1,
  name: `Tank ${i + 1}`,
  nation: 'ussr',
  tier: 1,
  type: 'lightTank',
  images: makeImages(i + 1),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetch.mockResolvedValue(baseVehicles);
});

afterEach(() => {
  jest.clearAllMocks();
});

/** Renders TankTable and resolves once the first data row appears. */
async function setup(firstRow = 'Tiger I') {
  render(<TankTable />);
  await screen.findByText(firstRow);
}

const filterInput = () =>
  screen.getByPlaceholderText(/filter tanks on current page/i);

const exactInput = () =>
  screen.getByPlaceholderText(/full tank name/i);

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('TankTable — rendering', () => {
  it('shows a loading indicator while fetching', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<TankTable />);
    expect(screen.getByText(/loading tanks/i)).toBeInTheDocument();
  });

  it('renders all vehicles once data has loaded', async () => {
    await setup();
    expect(screen.getByText('Tiger I')).toBeInTheDocument();
    expect(screen.getByText('Löwe')).toBeInTheDocument();
    expect(screen.getByText('T-34')).toBeInTheDocument();
  });
});

// ─── Page filter ─────────────────────────────────────────────────────────────

describe('TankTable — page filter', () => {
  it('hides non-matching rows on the current page', async () => {
    await setup();
    fireEvent.change(filterInput(), { target: { value: 'tiger' } });
    expect(screen.getByText('Tiger I')).toBeInTheDocument();
    expect(screen.queryByText('T-34')).not.toBeInTheDocument();
    expect(screen.queryByText('Löwe')).not.toBeInTheDocument();
  });

  it('matches names that contain diacritics (Lowe → Löwe)', async () => {
    await setup();
    fireEvent.change(filterInput(), { target: { value: 'lowe' } });
    expect(screen.getByText('Löwe')).toBeInTheDocument();
    expect(screen.queryByText('Tiger I')).not.toBeInTheDocument();
  });

  it('shows an empty-state message when nothing matches', async () => {
    await setup();
    fireEvent.change(filterInput(), { target: { value: 'xxxxxxxxx' } });
    expect(screen.getByText(/no tanks found/i)).toBeInTheDocument();
  });
});

// ─── Pagination ──────────────────────────────────────────────────────────────

describe('TankTable — pagination', () => {
  const pageInput = () => screen.getByRole('spinbutton', { name: /page number/i });
  const pageSizeSelect = () => screen.getByRole('combobox', { name: /per page/i });
  beforeEach(() => {
    mockFetch.mockResolvedValue(manyVehicles);
  });

  it('starts on page 1 with Previous disabled', async () => {
    await setup('Tank 1');
    expect(pageInput()).toHaveValue(1);
    expect(screen.getByText(/of 2/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('navigates to next page and disables Next on the last page', async () => {
    await setup('Tank 1');
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
    expect(screen.queryByText('Tank 1')).not.toBeInTheDocument();
    expect(pageInput()).toHaveValue(2);
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('navigates back to the previous page', async () => {
    await setup('Tank 1');
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(screen.getByText('Tank 1')).toBeInTheDocument();
    expect(screen.queryByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).not.toBeInTheDocument();
  });

  it('resets to page 1 when page size changes', async () => {
    await setup('Tank 1');
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    // Switch to a page size smaller than total items so pagination stays visible.
    fireEvent.change(pageSizeSelect(), { target: { value: String(PAGE_SIZE_OPTIONS[0]) } });
    expect(pageInput()).toHaveValue(1);
  });

  it('hides pagination when all items fit on one page', async () => {
    mockFetch.mockResolvedValue(baseVehicles);
    await setup('Tiger I');
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
  });

  it('shows pagination when items span multiple pages', async () => {
    await setup('Tank 1');
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('jumps to a page via manual input on Enter', async () => {
    await setup('Tank 1');
    fireEvent.change(pageInput(), { target: { value: '2' } });
    fireEvent.keyDown(pageInput(), { key: 'Enter' });
    expect(pageInput()).toHaveValue(2);
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
  });

  it('jumps to a page via manual input on blur', async () => {
    await setup('Tank 1');
    fireEvent.change(pageInput(), { target: { value: '2' } });
    fireEvent.blur(pageInput());
    expect(pageInput()).toHaveValue(2);
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
  });

  it('clamps numbers exceeding totalPages to the last page on commit', async () => {
    await setup('Tank 1');
    fireEvent.change(pageInput(), { target: { value: '999' } });
    fireEvent.keyDown(pageInput(), { key: 'Enter' });
    expect(pageInput()).toHaveValue(2);
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
  });

  it('ignores non-digit characters', async () => {
    await setup('Tank 1');
    fireEvent.change(pageInput(), { target: { value: '-5' } });
    expect(pageInput()).toHaveValue(1);
    fireEvent.change(pageInput(), { target: { value: '1.5' } });
    expect(pageInput()).toHaveValue(1);
    fireEvent.change(pageInput(), { target: { value: '2e3' } });
    expect(pageInput()).toHaveValue(1);
  });

  it('restores current page when input is cleared and blurred', async () => {
    await setup('Tank 1');
    fireEvent.change(pageInput(), { target: { value: '' } });
    fireEvent.blur(pageInput());
    expect(pageInput()).toHaveValue(1);
  });
});

// ─── Exact-name search ───────────────────────────────────────────────────────

describe('TankTable — exact-name search', () => {
  it('jumps to the page containing the matched tank', async () => {
    mockFetch.mockResolvedValue(manyVehicles);
    await setup('Tank 1');
    fireEvent.change(exactInput(), { target: { value: `Tank ${DEFAULT_PAGE_SIZE + 1}` } });
    fireEvent.click(screen.getByRole('button', { name: /^find$/i }));
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
    expect(screen.queryByText('Tank 1')).not.toBeInTheDocument();
  });

  it('resolves diacritics in the query (Lowe → Löwe)', async () => {
    await setup();
    fireEvent.change(exactInput(), { target: { value: 'Lowe' } });
    fireEvent.click(screen.getByRole('button', { name: /^find$/i }));
    expect(screen.getByText('Löwe')).toBeInTheDocument();
    expect(screen.queryByText(/tank not found/i)).not.toBeInTheDocument();
  });

  it('triggers search on Enter key', async () => {
    mockFetch.mockResolvedValue(manyVehicles);
    await setup('Tank 1');
    fireEvent.change(exactInput(), { target: { value: `Tank ${DEFAULT_PAGE_SIZE + 1}` } });
    fireEvent.keyDown(exactInput(), { key: 'Enter' });
    expect(screen.getByText(`Tank ${DEFAULT_PAGE_SIZE + 1}`)).toBeInTheDocument();
  });

  it('shows a not-found message and clears it on next input', async () => {
    await setup();
    fireEvent.change(exactInput(), { target: { value: 'Maus XXIII' } });
    fireEvent.click(screen.getByRole('button', { name: /^find$/i }));
    expect(screen.getByText(/tank not found/i)).toBeInTheDocument();

    fireEvent.change(exactInput(), { target: { value: 'T' } });
    expect(screen.queryByText(/tank not found/i)).not.toBeInTheDocument();
  });
});
