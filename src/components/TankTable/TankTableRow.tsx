import { memo, FC } from 'react';
import { Vehicle } from '../../services/vehiclesService';

interface TankTableRowProps {
  vehicle: Vehicle;
  highlighted: boolean;
}

/** Renders a single vehicle as a table row including its icon. */
export const TankTableRow: FC<TankTableRowProps> = memo(({ vehicle, highlighted }) => (
  <tr
    className={[
      'tank-table__row tank-table__row--body',
      highlighted ? 'tank-table__row--highlighted' : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <td className="tank-table__cell tank-table__cell--image">
      <img
        src={vehicle.images.small_icon}
        alt={vehicle.name}
        className="tank-table__vehicle-icon"
        width={56}
        height={40}
      />
    </td>
    <td className="tank-table__cell">{vehicle.name}</td>
    <td className="tank-table__cell">{vehicle.nation}</td>
    <td className="tank-table__cell">{vehicle.tier}</td>
    <td className="tank-table__cell">{vehicle.type}</td>
  </tr>
));
