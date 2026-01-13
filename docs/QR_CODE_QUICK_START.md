# 🚀 SAFRGO QR Code - Quick Start Guide

**Get started in 3 minutes!**

---

## ⚡ Quick Usage

### 1. Basic QR Code (Simplest)

```tsx
import { AgencyQRCode } from "@/components/agency/agency-qr-code"

export function MyComponent() {
  return (
    <AgencyQRCode 
      url="https://safrgo.com/agencies/my-agency"
    />
  )
}
```

**Output**: 256×256 QR code with embedded SAFRGO logo

---

### 2. QR Code with Label

```tsx
<AgencyQRCode 
  url="https://safrgo.com/agencies/my-agency"
  size={280}
  showLabel={true}
/>
```

**Output**: 280×280 QR with "Scan to view profile" label below

---

### 3. QR Code with Download Button

```tsx
import { AgencyQRCode, downloadQRCode } from "@/components/agency/agency-qr-code"
import { Button } from "@/components/ui/button"
import { Download } from "@/components/icons"
import { useRef } from "react"

export function DownloadableQR() {
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (canvas) {
      downloadQRCode(canvas, "my-qr-code.png", 1024)
    }
  }

  return (
    <div>
      <div ref={qrRef}>
        <AgencyQRCode url="https://safrgo.com/agencies/my-agency" />
      </div>
      <Button onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  )
}
```

**Output**: QR code with download button → exports 1024×1024 PNG

---

### 4. Full Interactive Card (Easiest!)

```tsx
import { QRCodeCard } from "@/components/agency/qr-code-card"

export function MyAgencyPage() {
  return (
    <QRCodeCard 
      agencySlug="my-agency"
      agencyName="My Travel Agency"
    />
  )
}
```

**Output**: Complete card with QR, download, and share buttons

---

## 📋 Common Patterns

### Pattern: Agency Profile Page

```tsx
import { AgencyQRCode } from "@/components/agency/agency-qr-code"

export default function AgencyProfile({ agency }) {
  const agencyUrl = `${window.location.origin}/agencies/${agency.slug}`
  
  return (
    <div className="space-y-6">
      {/* Your other profile content */}
      
      <Card>
        <CardHeader>
          <CardTitle>Share This Agency</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AgencyQRCode 
            url={agencyUrl}
            size={240}
            showLabel={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Pattern: Dashboard Widget

```tsx
import { QRCodeCard } from "@/components/agency/qr-code-card"

export function DashboardQRWidget({ agency }) {
  return (
    <QRCodeCard 
      agencySlug={agency.slug}
      agencyName={agency.name}
    />
  )
}
```

---

### Pattern: Print Page

```tsx
import { PrintableQRCode } from "@/components/agency/printable-qr-code"

export default function QRCodePrintPage({ agency }) {
  return <PrintableQRCode agency={agency} />
}
```

Then navigate to the page and use `Ctrl+P` or the print button.

---

### Pattern: Modal/Dialog

```tsx
import { AgencyQRCode, downloadQRCode } from "@/components/agency/agency-qr-code"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ShareQRDialog({ open, onOpenChange, agencyUrl }) {
  const qrRef = useRef(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div ref={qrRef} className="flex justify-center">
            <AgencyQRCode url={agencyUrl} size={240} showLabel={true} />
          </div>
          <Button 
            onClick={() => {
              const canvas = qrRef.current?.querySelector("canvas")
              if (canvas) downloadQRCode(canvas, "qr.png", 1024)
            }}
            className="w-full"
          >
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 🎯 Size Guide

| Use Case | Display Size | Export Size |
|----------|-------------|-------------|
| Mobile view | 160-200px | 512px |
| Desktop card | 240-280px | 1024px |
| Print poster | 320-400px | 1024px+ |
| Business card | 160px | 512px |
| Full page print | 320px | 1024px |

---

## 🎨 Customization

### Custom Sizes

```tsx
<AgencyQRCode url={url} size={400} /> // Large
<AgencyQRCode url={url} size={160} /> // Small
```

### Custom Styling

```tsx
<AgencyQRCode 
  url={url}
  className="shadow-2xl rounded-2xl"
/>
```

### Loading Callback

```tsx
<AgencyQRCode 
  url={url}
  onLogoLoad={() => {
    console.log("QR ready!")
    // Enable download button, show notification, etc.
  }}
/>
```

---

## 📦 Component Props Reference

### AgencyQRCode

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | string | **required** | Target URL for QR |
| `size` | number | `256` | QR size in pixels |
| `showLabel` | boolean | `false` | Show label below QR |
| `onLogoLoad` | () => void | - | Callback when logo loads |
| `className` | string | `""` | Additional CSS classes |

### QRCodeCard

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `agencySlug` | string | **required** | Agency URL slug |
| `agencyName` | string | **required** | Agency display name |

### downloadQRCode

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `canvas` | HTMLCanvasElement | **required** | QR canvas element |
| `filename` | string | **required** | Output filename |
| `size` | number | `1024` | Export size in pixels |

---

## ✅ Checklist for Production

Before deploying:

- [ ] Verify `/icon.png` exists in `public/` folder
- [ ] Test QR scanning on 3+ different devices
- [ ] Test download functionality
- [ ] Test print output
- [ ] Verify URLs are correct
- [ ] Check loading states display properly
- [ ] Test on mobile and desktop
- [ ] Verify accessibility (keyboard navigation)

---

## 🐛 Troubleshooting

### Logo not showing?
```tsx
// Check if /icon.png exists
console.log("Logo path:", "/icon.png")

// Add callback to detect loading
<AgencyQRCode 
  url={url}
  onLogoLoad={() => console.log("✓ Logo loaded")}
/>
```

### QR not scanning?
- Ensure URL is valid and accessible
- Try larger size (280px+)
- Check lighting conditions
- Test with different scanner apps

### Download not working?
```tsx
// Debug: Check canvas exists
const canvas = qrRef.current?.querySelector("canvas")
console.log("Canvas found:", !!canvas)
```

---

## 🎓 Learning Resources

1. **Full Documentation**: [docs/QR_CODE_SYSTEM.md](QR_CODE_SYSTEM.md)
2. **9 Examples**: [docs/QR_CODE_EXAMPLES.tsx](QR_CODE_EXAMPLES.tsx)
3. **Visual Spec**: [docs/QR_CODE_VISUAL_SPEC.md](QR_CODE_VISUAL_SPEC.md)
4. **Implementation Summary**: [docs/QR_CODE_IMPLEMENTATION_SUMMARY.md](QR_CODE_IMPLEMENTATION_SUMMARY.md)

---

## 💡 Pro Tips

1. **Always use refs for download functionality**
   ```tsx
   const qrRef = useRef<HTMLDivElement>(null)
   ```

2. **Export at higher resolution for print**
   ```tsx
   downloadQRCode(canvas, "qr.png", 2048) // 2048×2048
   ```

3. **Use loading callbacks to enable features**
   ```tsx
   const [ready, setReady] = useState(false)
   <AgencyQRCode onLogoLoad={() => setReady(true)} />
   <Button disabled={!ready}>Download</Button>
   ```

4. **Combine with share API**
   ```tsx
   if (navigator.share) {
     await navigator.share({ url: agencyUrl })
   }
   ```

---

## 🚀 Next Steps

1. **Try basic example** → Copy example #1 above
2. **Add to your page** → Use your agency slug
3. **Test scanning** → Use phone camera
4. **Customize** → Adjust size and styling
5. **Deploy** → Ship to production!

---

**Need help?** Check the full documentation or review the example files.

**Ready to ship?** All components are production-ready! 🎉
