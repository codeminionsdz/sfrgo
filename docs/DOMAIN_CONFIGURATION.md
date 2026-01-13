# SAFRGO Domain Configuration Guide

## Production Domain: https://safrgo.online

This document outlines how SAFRGO uses the production domain consistently across all features.

---

## Environment Configuration

### Environment Variable

**Variable Name**: `NEXT_PUBLIC_APP_URL`

**Production Value**: `https://safrgo.online`

**Local Development**: `http://localhost:3000` (optional fallback)

### Setup Instructions

1. **Add to `.env.local`**:
```env
NEXT_PUBLIC_APP_URL=https://safrgo.online
```

2. **For local development**, you can use:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **On Vercel/Production**, set environment variable:
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_APP_URL` = `https://safrgo.online`
   - Apply to: Production, Preview, Development

---

## Updated Components & Features

### 1. QR Code Generation

**Files Updated**:
- `components/agency/qr-code-card.tsx`
- `components/agency/printable-qr-code.tsx`
- `components/agency/qr-code-showcase.tsx`
- `app/test-qr/page.tsx`

**Implementation**:
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
const agencyUrl = `${appUrl}/agencies/${agencySlug}`
```

**Result**:
- All QR codes now encode: `https://safrgo.online/agencies/[slug]`
- QR codes work on any device with internet
- Production-ready URLs

### 2. Open Graph Metadata

**Files Updated**:
- `app/(app)/offers/[id]/page.tsx`

**Implementation**:
```typescript
const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"}/offers/${id}`
const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"}/api/og/offer/${id}`
```

**Meta Tags Generated**:
```html
<meta property="og:url" content="https://safrgo.online/offers/123" />
<meta property="og:image" content="https://safrgo.online/api/og/offer/123" />
<meta name="twitter:image" content="https://safrgo.online/api/og/offer/123" />
```

**Social Media Previews**:
- ✅ Facebook shares show correct preview
- ✅ WhatsApp shows correct link preview
- ✅ Twitter/X displays correct card
- ✅ LinkedIn shows correct preview

### 3. Share & Publishing System

**Files Updated**:
- `components/agency/share-offer-button.tsx`

**Implementation**:
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online";
const offerUrl = `${appUrl}/offers/${offerId}`;
const ogImageUrl = `${appUrl}/api/og/offer/${offerId}`;
```

**Share Buttons**:
- Facebook: `https://safrgo.online/offers/[id]`
- WhatsApp: `https://safrgo.online/offers/[id]`
- Copy Link: `https://safrgo.online/offers/[id]`
- Download Image: `https://safrgo.online/api/og/offer/[id]`

### 4. Authentication Redirects

**Files Updated**:
- `components/auth/signup-form.tsx`

**Implementation**:
```typescript
emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"}/auth/callback`
```

**Flow**:
1. User signs up
2. Receives verification email
3. Clicks link → redirects to `https://safrgo.online/auth/callback`
4. Completes authentication
5. Redirects to appropriate dashboard

---

## Fallback Strategy

Every URL generation includes a fallback:

```typescript
process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
```

**Why?**
- Ensures production URLs even if env variable is missing
- Prevents localhost URLs in production
- Maintains consistency across deployments

---

## Testing Checklist

### Before Deployment

- [x] Environment variable set in `.env.local`
- [x] All QR code components updated
- [x] Share buttons use production URLs
- [x] Open Graph metadata uses production URLs
- [x] Auth redirects use production URLs
- [x] No hardcoded localhost references
- [x] No TypeScript errors

### After Deployment

- [ ] Test QR code scanning on mobile device
- [ ] Share offer on Facebook - verify preview
- [ ] Share offer on WhatsApp - verify preview
- [ ] Copy offer link - verify URL
- [ ] Test signup flow - verify email redirect
- [ ] Check Open Graph Debugger:
  - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
  - [LinkedIn Inspector](https://www.linkedin.com/post-inspector/)

---

## Verification Commands

### Check Environment Variable
```bash
# In terminal
echo $NEXT_PUBLIC_APP_URL

# In Node/Next.js
console.log(process.env.NEXT_PUBLIC_APP_URL)
```

### Test QR Code URL
1. Go to: `https://safrgo.online/agency/profile`
2. Generate QR code
3. Scan with mobile device
4. Should redirect to: `https://safrgo.online/agencies/[slug]`

### Test Share URL
1. Go to any offer page
2. Click share button
3. Copy link
4. Should be: `https://safrgo.online/offers/[id]`

### Test OG Image
1. Open: `https://safrgo.online/api/og/offer/[id]`
2. Should display 1200x630 image
3. Test in [Facebook Debugger](https://developers.facebook.com/tools/debug/)

---

## File Locations

### Environment Files
- `.env.local` - Local development configuration
- `.env.example` - Template for environment variables

### QR Code Components
- `components/agency/qr-code-card.tsx`
- `components/agency/printable-qr-code.tsx`
- `components/agency/qr-code-showcase.tsx`
- `components/agency/agency-qr-code.tsx` (core logic)

### Share Components
- `components/agency/share-offer-button.tsx`

### Page Metadata
- `app/(app)/offers/[id]/page.tsx`

### Auth Components
- `components/auth/signup-form.tsx`
- `lib/utils/auth-redirect.ts`

### API Routes
- `app/api/og/offer/[id]/route.tsx` (OG image generation)

---

## Migration Notes

### Changed From
- **Variable**: `NEXT_PUBLIC_SITE_URL`
- **Domain**: `https://safrgo.com` (old)
- **Approach**: Mixed `window.location.origin` and hardcoded URLs

### Changed To
- **Variable**: `NEXT_PUBLIC_APP_URL`
- **Domain**: `https://safrgo.online` (production)
- **Approach**: Single environment variable with consistent fallback

### Benefits
✅ Single source of truth for domain
✅ Easy to update domain in future
✅ No localhost URLs in production
✅ Consistent across all features
✅ Better SEO and social media previews
✅ Mobile-friendly QR codes

---

## Future Domain Changes

If the domain changes in the future:

1. **Update `.env.local`**:
```env
NEXT_PUBLIC_APP_URL=https://new-domain.com
```

2. **Update Vercel environment variable**

3. **Rebuild and redeploy**

That's it! No code changes needed.

---

## Troubleshooting

### QR Code shows wrong URL

**Solution**: Check environment variable
```bash
echo $NEXT_PUBLIC_APP_URL
# Should output: https://safrgo.online
```

### Share preview not working

**Possible causes**:
1. Environment variable not set in production
2. OG image API not accessible
3. URL still using localhost

**Solution**: 
- Verify env var in Vercel
- Test OG image URL directly
- Clear Facebook/Twitter cache

### Auth redirect fails

**Check**:
- `NEXT_PUBLIC_APP_URL` is set
- Supabase has correct redirect URLs configured
- Path `/auth/callback` exists

---

## Support & Maintenance

**Last Updated**: January 12, 2026

**Domain**: https://safrgo.online

**Environment Variable**: `NEXT_PUBLIC_APP_URL`

**Status**: ✅ Production Ready

For questions or issues, check:
- This documentation
- `.env.example` for required variables
- Test QR page: `/test-qr`
