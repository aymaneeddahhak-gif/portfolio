/**
 * The disciplines the rail can be filtered by. Every technology belongs to
 * exactly one of them; "all" is the filter UI's default and lives with the
 * labels in tech-items.ts rather than on an item.
 */
export type TechTrack =
  | "language"
  | "web"
  | "mobile"
  | "backend"
  | "devops"
  | "design";

export interface TechItem {
  id: string;
  /**
   * The icon's own brand hue in degrees — see the note in tech-items.ts.
   * Painted on `data-tone="light"` plates; on dark plates it only tints them.
   */
  accentHue: number;
  /**
   * Near-monochrome marks (GitHub, Next.js) carry a dark plate instead of a
   * saturated one, so the card takes the logo's own dark tone. Everything
   * else keeps the brand colour.
   */
  plateTone?: "dark";
  /** Which filter on the rail shows this entry. */
  track: TechTrack;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  officialUrl: string;
  linkDisplay: string;
  image: string;
  badgeColor?: string;
  tags: string[];
}
