# Social Sharing (Open Graph) Setup

## ✅ Implementation Complete

SAFRGO links now display professional, branded previews on all social platforms.

## 📱 Supported Platforms

- **WhatsApp**
- **Facebook**
- **Telegram**
- **Messenger**
- **Twitter/X**
- **LinkedIn**
- **Discord**

## 🖼️ What Users See

When sharing any SAFRGO link:

- **Image**: Official SAFRGO logo (`/logo.png`)
- **Title**: "SAFRGO – Your Trusted Travel Companion"
- **Description**: "Connect with verified travel agencies and discover trusted travel experiences worldwide."
- **URL**: https://safrgo.online

## 📄 Implementation Details

### Global Metadata (All Pages)
**Location**: `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://safrgo.online'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://safrgo.online',
    title: 'SAFRGO – Your Trusted Travel Companion',
    description: 'Connect with verified travel agencies and discover trusted travel experiences worldwide.',
    siteName: 'SAFRGO',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'SAFRGO Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAFRGO – Your Trusted Travel Companion',
    description: 'Connect with verified travel agencies and discover trusted travel experiences worldwide.',
    images: ['/logo.png'],
  },
}
```

### Dynamic OG Images (Offer Pages)
**Location**: `app/(app)/offers/[id]/page.tsx`

Offer detail pages generate **custom dynamic images** showing:
- Offer title
- Price
- Agency name
- Destination

Generated via: `/api/og/offer/[id]`

## 🧪 Testing

### 1. Facebook Sharing Debugger
https://developers.facebook.com/tools/debug/

1. Enter: `https://safrgo.online`
2. Click "Debug"
3. Verify logo appears
4. Click "Scrape Again" to refresh cache

### 2. Twitter/X Card Validator
https://cards-dev.twitter.com/validator

1. Enter: `https://safrgo.online`
2. Preview the card
3. Verify logo and text

### 3. OpenGraph.xyz (Universal)
https://www.opengraph.xyz/

1. Enter any SAFRGO URL
2. See preview for all platforms
3. Most reliable tool

### 4. WhatsApp Test
1. Share link: `https://safrgo.online`
2. Wait 2-3 seconds for preview
3. Logo should appear

### 5. LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

1. Enter: `https://safrgo.online`
2. Click "Inspect"
3. Verify preview

## 🔧 Troubleshooting

### Preview Not Updating

**Problem**: Old v0 image still appears

**Solutions**:
1. **Clear Facebook cache**: Use Facebook Sharing Debugger → "Scrape Again"
2. **Clear LinkedIn cache**: Use LinkedIn Post Inspector
3. **Wait**: Some platforms cache for 24-48 hours
4. **Add query param**: Share `https://safrgo.online?v=2` to force refresh

### Image Not Loading

**Checklist**:
- ✅ Image exists at `/public/logo.png`
- ✅ Image is publicly accessible (no auth)
- ✅ Image size is 1200x1200 (or 1200x630)
- ✅ Image format is PNG or JPG
- ✅ File size < 8 MB
- ✅ Absolute URL used: `https://safrgo.online/logo.png`

### Wrong Title/Description

**Check**:
1. Page has proper `export const metadata`
2. Layout.tsx has `metadataBase` set
3. No conflicting meta tags in HTML

## 📋 Pages with Custom OG Metadata

| Page | Custom Image | Custom Title |
|------|--------------|--------------|
| Homepage | ✅ Logo | ✅ Yes |
| About | ✅ Logo | ✅ Yes |
| Offers (details) | ⚡ Dynamic | ⚡ Dynamic |
| All other pages | ✅ Logo (inherited) | 📝 Per-page |

## 🎯 Best Practices

### ✅ DO
- Use absolute URLs (with domain)
- Set `metadataBase` in root layout
- Use 1200x630 or 1200x1200 images
- Keep descriptions under 200 characters
- Test on multiple platforms

### ❌ DON'T
- Use relative URLs for images
- Use external/CDN images (host locally)
- Use images > 8 MB
- Use complex/text-heavy images
- Forget to test after changes

## 🚀 Deployment Notes

After deploying to production:

1. **Test immediately** with OpenGraph.xyz
2. **Clear all caches** using Facebook Debugger
3. **Share test post** on WhatsApp/Telegram
4. **Monitor** first few shares
5. **Document** any issues

## 📊 Expected Results

### Before Fix
- ❌ Generic v0 placeholder image
- ❌ "v0 by Vercel" branding
- ❌ Unprofessional appearance

### After Fix
- ✅ Official SAFRGO logo
- ✅ Professional branded appearance
- ✅ Consistent across all platforms
- ✅ Builds trust and credibility

## 🔗 Related Documentation

- [OG_IMPLEMENTATION_SUMMARY.md](./OG_IMPLEMENTATION_SUMMARY.md) - Dynamic offer OG images
- [OG_TESTING_GUIDE.md](./OG_TESTING_GUIDE.md) - Detailed testing procedures
- [OG_QUICK_REF.md](./OG_QUICK_REF.md) - Quick reference guide

## ✨ Success Criteria

Your implementation is successful when:

1. ✅ Homepage shares show SAFRGO logo
2. ✅ Offer pages show custom dynamic images
3. ✅ All platforms display correct title/description
4. ✅ No v0 branding appears anywhere
5. ✅ Links look professional and trustworthy

---

**Last Updated**: January 13, 2026
**Status**: ✅ Implemented and Tested
