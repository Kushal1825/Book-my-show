import { CinemaModel } from './cinemas.schema.js';
import { ICinemaDocument } from './cinemas.types.js';
import { cache } from '../../shared/utils/cache.util.js';

const CINEMAS_CACHE_TTL_SECONDS = 300; // 5 minutes

/**
 * Fetch all active cinemas that belong to a given city, using the cache layer.
 *
 * @param cityId - The unique identifier of the city to filter by.
 * @returns Array of active cinema documents for the specified city.
 */
export async function getCinemasByCityId(cityId: string): Promise<ICinemaDocument[]> {
  const cacheKey = `cinemas:city:${cityId}`;

  return cache.remember(cacheKey, CINEMAS_CACHE_TTL_SECONDS, async () => {
    const cinemas = await CinemaModel.find({
      cityId,
      isActive: true,
    })
      .sort({ name: 1 }) // alphabetical order
      .lean<ICinemaDocument[]>()
      .exec();

    return cinemas;
  });
}
