import type { Tenant } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function fetchTenantByDomain(domain: string): Promise<Tenant | null> {
  const payload = await getPayload({ config: configPromise })
  const domainClean = domain.split(':')[0]

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domainClean } },
    depth: 1,
    limit: 1,
  })

  return docs[0] || null
}
