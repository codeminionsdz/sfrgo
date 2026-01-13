# 🚀 SAFRGO Production Domain - Quick Reference

## Domain
```
https://safrgo.online
```

## Environment Variable
```env
NEXT_PUBLIC_APP_URL=https://safrgo.online
```

---

## ✅ Updated Files

### QR Codes (4 files)
- ✅ `components/agency/qr-code-card.tsx`
- ✅ `components/agency/printable-qr-code.tsx`
- ✅ `components/agency/qr-code-showcase.tsx`
- ✅ `app/test-qr/page.tsx`

### Sharing System (1 file)
- ✅ `components/agency/share-offer-button.tsx`

### Open Graph / SEO (1 file)
- ✅ `app/(app)/offers/[id]/page.tsx`

### Authentication (1 file)
- ✅ `components/auth/signup-form.tsx`

### Environment (2 files)
- ✅ `.env.local`
- ✅ `.env.example`

---

## 📝 Pattern Used

```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
```

**All URLs now use**: `${appUrl}/path`

---

## 🎯 Results

| Feature | Old Behavior | New Behavior |
|---------|-------------|--------------|
| **QR Codes** | `window.location.origin` | `https://safrgo.online/agencies/[slug]` |
| **Share Links** | Mixed localhost/safrgo.com | `https://safrgo.online/offers/[id]` |
| **OG Images** | Relative URLs | `https://safrgo.online/api/og/offer/[id]` |
| **Auth Redirects** | Dynamic origin | `https://safrgo.online/auth/callback` |

---

## 🧪 Quick Tests

### Test 1: Check Environment
```bash
echo $NEXT_PUBLIC_APP_URL
# Expected: https://safrgo.online
```

### Test 2: QR Code
1. Navigate to `/agency/profile`
2. Generate QR code
3. Scan with phone
4. Should open: `https://safrgo.online/agencies/[slug]`

### Test 3: Share Button
1. Open any offer page
2. Click share → copy link
3. Should be: `https://safrgo.online/offers/[id]`

### Test 4: OG Image
```
https://safrgo.online/api/og/offer/[any-offer-id]
```
Should display a 1200×630 image

---

## 🔧 Deployment Checklist

### Vercel Setup
1. Go to Project Settings → Environment Variables
2. Add:
   - **Key**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://safrgo.online`
   - **Environments**: Production, Preview, Development
3. Redeploy

### DNS Setup
✅ Point domain `safrgo.online` to Vercel
✅ SSL certificate active
✅ HTTPS enforced

---

## 📦 No Localhost in Production

**Before**: Mixed URLs
```typescript
// ❌ Old approach
const url = window.location.origin + "/path"
const url = "https://safrgo.com/path"
const url = "http://localhost:3000/path"
```

**After**: Consistent production URLs
```typescript
// ✅ New approach
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online"
const url = `${appUrl}/path`
```

---

## 🎨 Features Using Production Domain

✅ Agency QR codes
✅ Offer sharing (Facebook, WhatsApp, Twitter)
✅ Open Graph images
✅ Social media previews
✅ Email verification links
✅ Auth callback URLs
✅ Copy-to-clipboard links
✅ Download QR codes

---

## 📚 Documentation

**Full Guide**: [`docs/DOMAIN_CONFIGURATION.md`](./DOMAIN_CONFIGURATION.md)

**Related Docs**:
- `docs/OFFER_SHARING.md` - Sharing system
- `docs/QR_CODE_SYSTEM.md` - QR code implementation

---

## 💡 Tips

**Local Development**:
```env
# Use localhost for testing
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production**:
```env
# Always use production domain
NEXT_PUBLIC_APP_URL=https://safrgo.online
```

**Best Practice**: Always test production URLs before deploying!

---

**Status**: ✅ Production Ready
**Last Updated**: January 12, 2026
