import { memo, FC } from 'react';
import { Vehicle } from '../../services/vehiclesService';
import { TankTableRow } from './TankTableRow';
import { COLUMNS } from './TankTable.constants';

interface TankTableContentProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  highlightedId: number | null;
}

/** Renders the scrollable table wrapper with header and body rows. */
export const TankTableContent: FC<TankTableContentProps> = memo(({
  vehicles,
  isLoading,
  highlightedId,
}) => (
  <div className="tank-table__wrapper">
    <table className="tank-table__table" aria-label="Tanks">
      <thead className="tank-table__head">
        <tr className="tank-table__row tank-table__row--head">
          <th scope="col" className="tank-table__cell tank-table__cell--head tank-table__cell--image" />
          {COLUMNS.map((col) => (
            <th key={col} scope="col" className="tank-table__cell tank-table__cell--head">
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="tank-table__body">
        {isLoading ? (
          <tr className="tank-table__row tank-table__row--loading">
            <td className="tank-table__cell" colSpan={5}>
              <div className="tank-table__loader" role="status">
                <span className="tank-table__loader-spinner" aria-hidden="true" />
                <span className="tank-table__loader-text">Loading tanks…</span>
              </div>
            </td>
          </tr>
        ) : (
          <>
            {vehicles.map((vehicle) => (
              <TankTableRow
                key={vehicle.tank_id}
                vehicle={vehicle}
                highlighted={vehicle.tank_id === highlightedId}
              />
            ))}
            {vehicles.length === 0 && (
              <tr className="tank-table__row tank-table__row--empty">
                <td className="tank-table__cell" colSpan={5}>
                  No tanks found on this page.
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  </div>
));
