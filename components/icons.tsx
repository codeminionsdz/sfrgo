import {
  Plane,
  Globe,
  MapPin,
  Star,
  Heart,
  Bookmark,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  User,
  Settings,
  LogOut,
  MessageCircle,
  Bell,
  Home,
  Compass,
  Building2,
  Shield,
  BadgeCheck,
  Clock,
  Calendar,
  Users,
  DollarSign,
  Filter,
  SlidersHorizontal,
  Send,
  ImageIcon,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  Loader2,
  Mountain,
  Umbrella,
  Bird,
  Landmark,
  Upload,
  Download,
  CreditCard,
  BarChart3,
  TrendingUp,
  Package,
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  Ban,
  FileText,
  Lock,
  QrCode,
  Printer,
  Share2,
  Locate,
  Copy,
  Banknote,
  Receipt,
  Facebook,
  Instagram,
  Zap,
  Crown,
  Briefcase,
  Rocket,
  Newspaper,
  Phone,
  Trophy,
  BookOpen,
  Camera,
  type LucideIcon,
} from "lucide-react"

export {
  Plane,
  Globe,
  MapPin,
  Star,
  Heart,
  Bookmark,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  User,
  Settings,
  LogOut,
  MessageCircle,
  Bell,
  Home,
  Compass,
  Building2,
  Shield,
  BadgeCheck,
  Clock,
  Calendar,
  Users,
  DollarSign,
  Filter,
  SlidersHorizontal,
  Send,
  ImageIcon,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  Loader2,
  Mountain,
  Umbrella,
  Bird,
  Landmark,
  Upload,
  Download,
  CreditCard,
  BarChart3,
  TrendingUp,
  Package,
  Mail,
  RefreshCw,
  CheckCircle,
  XCircle,
  Ban,
  FileText,
  Lock,
  QrCode,
  Printer,
  Share2,
  Locate,
  Copy,
  Banknote,
  Receipt,
  Facebook,
  Instagram,
  Zap,
  Crown,
  Briefcase,
  Rocket,
  Newspaper,
  Phone,
  Trophy,
  BookOpen,
  Camera,
}

export type { LucideIcon }

// Custom SAFRGO Logo component
export function SafrgoLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue circle with plane */}
      <circle cx="20" cy="20" r="16" className="fill-primary" />
      <path
        d="M14 20L20 14L26 20M20 14V28"
        className="stroke-primary-foreground"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-45 20 20)"
      />
      {/* Purple pill accent */}
      <rect x="28" y="8" width="8" height="24" rx="4" className="fill-accent" transform="rotate(15 32 20)" />
      {/* SAFRGO text */}
      <text
        x="52"
        y="28"
        className="fill-foreground font-sans"
        style={{
          fontSize: "24px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          fontFamily: "inherit",
        }}
      >
        SAFRGO
      </text>
    </svg>
  )
}

// Alternative text-based logo for simpler rendering
export function SafrgoLogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Plane className="w-4 h-4 text-primary-foreground -rotate-45" />
        </div>
        <div className="absolute -right-1 top-0 w-3 h-6 rounded-full bg-accent rotate-[20deg]" />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-foreground">SAFRGO</span>
    </div>
  )
}
