export interface Vehicle {
  tank_id: number;
  name: string;
  nation: string;
  tier: number;
  type: string;
  images: {
    small_icon: string;
  };
}

export interface VehiclesApiResponse {
  status: string;
  data: Record<string, Vehicle> | null;
}

const VEHICLES_API_URL =
  'https://api.tanki.su/wot/encyclopedia/vehicles/?application_id=22716c2a0bff5e7fbced747f4c19b614';

/**
 * Fetches vehicles from the Tanki encyclopedia API and returns them as array.
 * Throws an `Error` on network failures or non-2xx HTTP responses.
 */
export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await fetch(VEHICLES_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as VehiclesApiResponse;

  if (!json.data) {
    return [];
  }

  return Object.values(json.data).map(({ tank_id, name, nation, tier, type, images }) => ({
    tank_id,
    name,
    nation,
    tier,
    type,
    images: {
      small_icon: images.small_icon.replace('http://', 'https://')
    },
  }));
}
