import { UtensilsCrossed, CookingPot, Soup, CupSoda, Cake, UtensilsIcon } from "lucide-react";

const ICONS: Record<string, typeof UtensilsCrossed> = {
  fork: UtensilsCrossed,
  pot: CookingPot,
  bowl: Soup,
  cup: CupSoda,
  cake: Cake,
};

export function CategoryIcon({
  icon,
  size = 17,
  className,
}: {
  icon: string | null;
  size?: number;
  className?: string;
}) {
  const Icon = (icon && ICONS[icon]) || UtensilsIcon;
  return <Icon size={size} className={className} />;
}
