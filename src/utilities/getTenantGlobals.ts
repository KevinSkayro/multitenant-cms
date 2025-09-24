import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['collections']

async function getGlobal(collection: Global, depth = 0, tenantId: number) {
  const payload = await getPayload({ config: configPromise })

  if (!tenantId) return null

  const { docs } = await payload.find({
    collection,
    where: { 'tenant.id': { equals: tenantId } },
    depth,
    limit: 1,
  })

  return docs[0] || null
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getTenantCachedGlobal = (collection: Global, depth = 0, tenantId: number) =>
  unstable_cache(async () => getGlobal(collection, depth, tenantId), [collection], {
    tags: [`global_${collection}`],
  })
