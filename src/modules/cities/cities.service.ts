import { CityModel } from './cities.schema.js';
import { CityFilter, ICityDocument } from './cities.types.js';
import { cache } from '../../shared/utils/cache.util.js';

/** Cache TTL: 5 minutes (300 seconds) */
const CITIES_CACHE_TTL_SECONDS = 300;

/**
 * Fetch all cities, utilizing the fast in-memory / Redis cache layer.
 * On cache miss, queries MongoDB Atlas and stores result for 5 minutes.
 *
 * @param filter - Optional filter object. When omitted, only active cities are returned.
 * @returns Array of city documents matching the filter criteria.
 */
export async function getAllCities(filter?: CityFilter): Promise<ICityDocument[]> {
  const isActiveFilter = filter?.isActive !== undefined ? filter.isActive : true;
  const cacheKey = `cities:list:${isActiveFilter ? 'active' : 'all'}`;

  return cache.remember(cacheKey, CITIES_CACHE_TTL_SECONDS, async () => {
    const query: Record<string, unknown> = {};

    if (filter?.isActive !== undefined) {
      query.isActive = filter.isActive;
    } else {
      // Default behaviour: return only active cities
      query.isActive = true;
    }

    const cities = await CityModel.find(query)
      .sort({ name: 1 }) // alphabetical order
      .lean<ICityDocument[]>()
      .exec();

    return cities;
  });
}
