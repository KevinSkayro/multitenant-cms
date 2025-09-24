import type { CollectionAfterLoginHook } from 'payload'
import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  const tenant = await req.payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: req.headers.get('host')?.split(':')[0],
      },
    },
  })

  if (tenant && tenant.docs.length > 0) {
    const secure = process.env.NODE_ENV === 'production'
    const tenantCookie = generateCookie({
      name: 'payload-tenant',
      expires: getCookieExpiration({ seconds: 7200 }),
      path: '/',
      secure,
      returnCookieAsObject: false,
      value: String(tenant.docs[0].id),
    })

    const newHeaders = new Headers({
      'Set-Cookie': tenantCookie as string,
    })

    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders
  }

  return user
}
