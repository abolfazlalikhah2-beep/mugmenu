import type { HelpCategory } from "@/components/marketing/help-data";

export function HelpCategoryIcon({ icon }: { icon: HelpCategory["icon"] }) {
  switch (icon) {
    case "menu":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 15l4.5-4 3.5 3 3.5-4L21 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="9.5" r="1.4" fill="currentColor" />
        </>
      );
    case "dashboard":
      return (
        <>
          <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      );
    case "login":
      return (
        <>
          <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      );
    case "start":
      return <path d="M13 2L4 14h6l-1 8 9-12h-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />;
    case "pos":
      return (
        <>
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 9h18M8 13h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M9 21h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      );
    case "order-settings":
      return (
        <>
          <path d="M4 6h2l2 11h9l2-8H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="20" r="1.3" fill="currentColor" />
          <circle cx="16" cy="20" r="1.3" fill="currentColor" />
        </>
      );
    case "qr":
      return (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
          <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 14h3v3h-3zM19 19h2v2h-2z" fill="currentColor" />
        </>
      );
    case "categories":
      return (
        <>
          <path d="M12 3l8 4-8 4-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "support":
      return (
        <>
          <path d="M4 13a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <rect x="3" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
          <rect x="17" y="13" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.7" />
        </>
      );
    case "billing":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
          <path d="M7 15h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </>
      );
    case "loyalty":
      return (
        <>
          <path d="M20 8h-3.2a2.5 2.5 0 10-4.8-1 2.5 2.5 0 10-4.8 1H4a1 1 0 00-1 1v3a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4 13v6a1 1 0 001 1h14a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v12" stroke="currentColor" strokeWidth="1.6" />
        </>
      );
    case "reports":
      return <path d="M4 20V5M4 20h16M8 16l3.5-4 3 2.4L20 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />;
    default:
      return null;
  }
}
