# Open Graph Testing Guide for SAFRGO

## Overview
This guide helps you test and verify the Open Graph (OG) metadata implementation for offer sharing on social platforms.

## What Was Implemented

### 1. Server-Side Metadata (Next.js 14 App Router)
Location: `app/(app)/offers/[id]/page.tsx`

✅ **Implemented Features:**
- Dynamic OG metadata generation per offer
- Absolute URLs for all OG images
- Full support for Facebook, WhatsApp, Twitter/X
- SEO optimizations (keywords, robots, canonical)
- Proper fallbacks for missing data

### 2. Dynamic OG Image Generation
Location: `app/api/og/offer/[id]/route.tsx`

✅ **Features:**
- 1200x630 professional image generation
- Displays:
  - Offer title
  - Destination and duration
  - Price in DZD or other currency
  - Agency name and logo
  - Verified badge (if applicable)
  - SAFRGO branding
- Edge runtime for fast generation
- Caching headers (24h cache, 12h stale-while-revalidate)

### 3. Share Button Integration
Location: `components/agency/share-offer-button.tsx`

✅ **Features:**
- Native share API (mobile)
- WhatsApp, Facebook, Instagram sharing
- Copy link functionality
- Download OG image option

## Testing Checklist

### 1. Verify Environment Variables
```bash
# Check .env.local has:
NEXT_PUBLIC_APP_URL=https://safrgo.online
```

### 2. Test OG Image Generation
**URL Format:**
```
https://safrgo.online/api/og/offer/[offer-id]
```

**Test Steps:**
1. Get a real offer ID from your database
2. Open in browser: `https://safrgo.online/api/og/offer/{offer-id}`
3. You should see a 1200x630 PNG image with offer details

**Example:**
```
https://safrgo.online/api/og/offer/123e4567-e89b-12d3-a456-426614174000
```

### 3. Test Offer Page Metadata

**View HTML Source:**
1. Visit: `https://safrgo.online/offers/{offer-id}`
2. Right-click → View Page Source
3. Search for `<meta property="og:` tags

**Expected Meta Tags:**
```html
<meta property="og:title" content="عرض العمرة - رحلة دينية" />
<meta property="og:description" content="مكة المكرمة، السعودية - 7 أيام - 150,000 دج للشخص" />
<meta property="og:url" content="https://safrgo.online/offers/..." />
<meta property="og:image" content="https://safrgo.online/api/og/offer/..." />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="SAFRGO - اكتشف أفضل العروض السياحية" />
<meta property="og:locale" content="ar_DZ" />
```

### 4. WhatsApp Testing

**Method 1: WhatsApp Web**
1. Open WhatsApp Web
2. Send offer link to yourself or a test contact
3. Check preview appears with:
   - Offer image
   - Title
   - Description
   - SAFRGO branding

**Method 2: Mobile**
1. Use share button → WhatsApp
2. Check preview before sending
3. Send and verify recipient sees preview

**Troubleshooting:**
- WhatsApp caches URLs for ~7 days
- Test with new offers or add `?v=1` to URL
- Clear WhatsApp cache in app settings

### 5. Facebook Link Debugger

**URL:** https://developers.facebook.com/tools/debug/

**Steps:**
1. Paste offer URL: `https://safrgo.online/offers/{offer-id}`
2. Click "Debug"
3. Check for:
   - ✅ No errors or warnings
   - ✅ Image loads correctly
   - ✅ Title and description display
   - ✅ Image size 1200x630

**Refresh Cache:**
- Click "Scrape Again" to force Facebook to re-fetch

### 6. Twitter/X Card Validator

**URL:** https://cards-dev.twitter.com/validator

**Steps:**
1. Paste offer URL
2. Verify "Summary Card with Large Image" displays
3. Check image, title, description

### 7. Discord Testing

**Steps:**
1. Paste offer link in any Discord channel
2. Discord auto-embeds the link
3. Verify rich preview with image

### 8. LinkedIn Post Inspector

**URL:** https://www.linkedin.com/post-inspector/

**Steps:**
1. Paste URL
2. Verify preview
3. LinkedIn may require authentication

### 9. General Meta Tags Testing

**Tools:**
- [OpenGraph.xyz](https://www.opengraph.xyz/)
- [Meta Tags Checker](https://metatags.io/)

**Test URL:**
```
https://www.opengraph.xyz/?url=https://safrgo.online/offers/{offer-id}
```

## Common Issues & Solutions

### Issue 1: OG Image Not Loading
**Symptoms:** Broken image in preview
**Solutions:**
1. Verify `NEXT_PUBLIC_APP_URL` is set correctly
2. Check offer has a valid image URL
3. Test image URL directly in browser
4. Check Supabase image storage permissions

### Issue 2: Old Preview Cached
**Symptoms:** Preview doesn't update after changes
**Solutions:**
1. Use Facebook Debugger → "Scrape Again"
2. Add cache-busting param: `?v=2`
3. Wait 24-48 hours for natural cache expiry
4. Use WhatsApp cache clearing

### Issue 3: Arabic Text Not Displaying
**Symptoms:** Boxes or missing text
**Solutions:**
1. Verify `og:locale` is set to `ar_DZ`
2. Check font rendering in OG image route
3. Test with mixed Arabic/English content

### Issue 4: Image Generation Fails
**Symptoms:** 500 error from `/api/og/offer/[id]`
**Solutions:**
1. Check server logs for errors
2. Verify offer ID exists in database
3. Check agency has required fields
4. Test Supabase connection

### Issue 5: Relative URLs Used
**Symptoms:** Images don't load on social platforms
**Solutions:**
1. All URLs must be absolute: `https://safrgo.online/...`
2. Never use `/api/og/...` without domain
3. Check `NEXT_PUBLIC_APP_URL` environment variable

## Performance Considerations

### Caching Strategy
```typescript
// Current settings in route.tsx:
'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
```

- **s-maxage=86400**: Cache for 24 hours
- **stale-while-revalidate=43200**: Serve stale for 12 hours while revalidating

### Edge Runtime
- Deployed to edge for low latency
- Generates images in <100ms globally
- Minimal cold start times

## Production Checklist

Before going live, verify:

- [ ] `NEXT_PUBLIC_APP_URL` is production URL
- [ ] Test 5+ different offers
- [ ] Test on WhatsApp (most critical)
- [ ] Test on Facebook Debugger
- [ ] Test with and without agency logo
- [ ] Test with Arabic and English titles
- [ ] Test with long titles (truncation)
- [ ] Test with missing offer images
- [ ] Test with discounted prices
- [ ] Verify mobile preview (actual devices)

## Maintenance

### When to Regenerate OG Images
- Offer details change (title, price, etc.)
- Agency logo updates
- Design improvements needed
- Branding changes

### How to Force Regeneration
1. Images auto-regenerate on request after cache expiry
2. Use Vercel's cache purging API if needed
3. Deploy new changes → cache auto-invalidates

## Quick Test Command

For developers, test all URLs quickly:

```bash
# Test OG image generation
curl -I "https://safrgo.online/api/og/offer/{offer-id}"
# Should return 200 OK and image/png content-type

# Test metadata
curl "https://safrgo.online/offers/{offer-id}" | grep "og:image"
# Should show full absolute URL
```

## Support Resources

- [Open Graph Protocol](https://ogp.me/)
- [WhatsApp Link Preview](https://faq.whatsapp.com/1393557894670274)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

**Last Updated:** January 12, 2026
**Version:** 1.0
**Status:** ✅ Fully Implemented & Ready for Testing
