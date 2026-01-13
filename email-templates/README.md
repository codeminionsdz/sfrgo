# SAFRGO Email Templates

Professional branded email templates for Supabase Auth.

---

## 📧 Available Templates

### 1. Confirm Signup (`confirm-signup.html`)
Email sent when a user signs up to verify their email address.

**Supabase Event**: `confirmation`

**Variables Used**:
- `{{ .ConfirmationURL }}` - The verification link

---

## 🎨 Design Features

### Branding
- ✅ SAFRGO logo at the top
- ✅ Brand colors (Blue #3b82f6, Purple #9333ea)
- ✅ Professional typography
- ✅ Clean, modern design

### Language & Direction
- ✅ Arabic language (primary)
- ✅ RTL (Right-to-Left) support
- ✅ Professional, respectful tone

### Responsive Design
- ✅ Mobile-friendly
- ✅ Email-safe HTML (inline styles)
- ✅ Works in all email clients

### User Experience
- ✅ Clear call-to-action button
- ✅ Security note (24-hour expiry)
- ✅ Alternative text link
- ✅ Trust badges
- ✅ Footer with links

---

## 🚀 How to Use with Supabase

### Method 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**:
   - Navigate to: Authentication → Email Templates
   - Or: https://supabase.com/dashboard/project/[your-project]/auth/templates

2. **Select Template Type**:
   - Click: "Confirm signup"

3. **Replace Content**:
   - Copy entire content from `confirm-signup.html`
   - Paste into the template editor
   - Make sure to keep `{{ .ConfirmationURL }}`

4. **Preview**:
   - Use the preview feature
   - Test with a real signup

5. **Save**:
   - Click "Save"
   - Template is now active!

### Method 2: Supabase CLI

```bash
# Using Supabase CLI
supabase functions deploy confirm-email --project-ref your-project-ref

# Or update via API
curl -X PUT 'https://your-project.supabase.co/auth/v1/admin/config' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "MAILER_TEMPLATES_CONFIRM": "$(cat confirm-signup.html)"
  }'
```

---

## 🧪 Testing

### Test Signup Flow

1. **Create Test User**:
```bash
# In your app
await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test-password-123'
})
```

2. **Check Email**:
   - Look for email in test inbox
   - Verify SAFRGO branding appears
   - Confirm button works
   - Test alternative link

3. **Verify Design**:
   - Check on desktop email client
   - Check on mobile device
   - Test in different email providers:
     - Gmail
     - Outlook
     - Apple Mail
     - Yahoo Mail

---

## 🎨 Customization

### Update Logo

The logo is inline SVG. To change:

1. Find this section:
```html
<svg width="120" height="32" viewBox="0 0 200 40" fill="none">
  <!-- Logo SVG code -->
</svg>
```

2. Replace with your own SVG or use image:
```html
<img src="https://safrgo.online/logo.png" alt="SAFRGO" width="120" style="display: block; margin: 0 auto;">
```

### Update Colors

**Primary Blue**: `#3b82f6`
**Purple Accent**: `#9333ea`

Find and replace these hex codes throughout the template.

### Update Text

All text is in Arabic. To change:

1. Find text sections
2. Update as needed
3. Keep structure intact

### Update Links

Footer links point to:
- `https://safrgo.online`
- `https://safrgo.online/explore`
- `https://safrgo.online/agencies`

Update these to match your routes.

---

## 📝 Template Variables

Supabase provides these variables for email templates:

### Confirm Signup
- `{{ .ConfirmationURL }}` - Link to confirm email
- `{{ .Token }}` - Verification token (optional)
- `{{ .TokenHash }}` - Token hash (optional)
- `{{ .SiteURL }}` - Your site URL

### Other Templates (for future use)
- `{{ .RecoveryURL }}` - Password reset link
- `{{ .InviteURL }}` - Invitation link
- `{{ .EmailChangeURL }}` - Email change confirmation

---

## 🔒 Security Best Practices

✅ **Link Expiry**: Template mentions 24-hour expiry
✅ **HTTPS Only**: Use `https://safrgo.online`
✅ **No JavaScript**: Email-safe HTML only
✅ **Safe Fallback**: Alternative text link provided
✅ **Clear Instructions**: User knows what to do

---

## 🌐 Email Client Compatibility

Tested and working in:
- ✅ Gmail (Desktop & Mobile)
- ✅ Apple Mail (macOS & iOS)
- ✅ Outlook (Windows & Web)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

**Note**: Some email clients strip certain CSS. We use:
- Inline styles only
- Table-based layout
- Email-safe properties

---

## 📊 Template Structure

```
┌─────────────────────────────┐
│         LOGO & TITLE        │ Header
├─────────────────────────────┤
│                             │
│      Welcome Message        │
│                             │
│    [Confirm Email Button]   │ Main Content
│                             │
│     Security Note Box       │
│                             │
│    Alternative Link         │
│                             │
├─────────────────────────────┤
│   Trust Badges              │
│   © Copyright               │ Footer
│   Links                     │
│                             │
└─────────────────────────────┘
```

---

## 🎯 Email Best Practices Applied

### Content
- ✅ Clear subject (set in Supabase)
- ✅ Personalized greeting
- ✅ Single clear CTA
- ✅ Explains what to do
- ✅ Sets expectations (24h expiry)

### Design
- ✅ Mobile-responsive
- ✅ Readable fonts
- ✅ Sufficient contrast
- ✅ Consistent branding
- ✅ Professional appearance

### Technical
- ✅ Inline CSS
- ✅ Table-based layout
- ✅ Alt text for images
- ✅ Email-safe HTML
- ✅ No external dependencies

---

## 🔄 Future Templates

You can create similar templates for:

1. **Password Reset** (`recovery`)
   - Use: `{{ .RecoveryURL }}`
   - Similar design
   - Different messaging

2. **Magic Link** (`magic_link`)
   - Use: `{{ .ConfirmationURL }}`
   - Passwordless login

3. **Email Change** (`email_change`)
   - Use: `{{ .EmailChangeURL }}`
   - Confirm new email

4. **Invite User** (`invite`)
   - Use: `{{ .InviteURL }}`
   - Welcome to team

---

## 📞 Support

**Issues with Template?**
- Check Supabase logs
- Verify variables are correct
- Test in email client
- Check spam folder

**Need Customization?**
- Edit HTML directly
- Keep inline styles
- Test thoroughly
- Maintain accessibility

---

## ✅ Checklist

Before going live:

- [ ] Template uploaded to Supabase
- [ ] Preview looks correct
- [ ] Test signup creates user
- [ ] Email received successfully
- [ ] Logo displays correctly
- [ ] Button links work
- [ ] Alternative link works
- [ ] Footer links work
- [ ] Mobile responsive
- [ ] Tested in multiple email clients

---

**Template Version**: 1.0
**Last Updated**: January 12, 2026
**Maintained By**: SAFRGO Team
