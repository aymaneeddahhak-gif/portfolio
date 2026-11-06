import type { TechItem } from "./types";

interface HeldBadgeProps {
  item: TechItem;
}

/**
 * The badge the subject is holding up: the active technology levitating just
 * above his raised hand. Pure non-clickable floating visual.
 */
export function HeldBadge({ item }: HeldBadgeProps) {
  return (
    <div
      aria-label={item.name}
      title={item.name}
      className="relative block w-full select-none pointer-events-none"
    >
      {/* Contact shadow, so the badge reads as levitating */}
      <span
        aria-hidden="true"
        className="absolute -bottom-[8%] left-1/2 h-[12%] w-[56%] -translate-x-1/2 rounded-full bg-[#22305e]/25 blur-md"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={item.id}
        src={item.image}
        alt={item.name}
        className="about-fade-in relative block aspect-square w-full object-contain drop-shadow-[0_18px_26px_rgba(27,39,87,0.32)] transition-transform duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
