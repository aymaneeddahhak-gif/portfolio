/**
 * The hero's two device mockups: scaled down to compact, sleek icon size
 * alongside the heading text so the text is visibly bigger and prominent.
 */
export function PhoneFrame() {
  return (
    <div
      className="hero-device hero-device--phone relative flex h-[22px] w-[13.5px] shrink-0 justify-center overflow-hidden rounded-[3.5px] border-[1.8px] border-[#151722] bg-gray-50 sm:h-[25px] sm:w-[15.5px] lg:h-[28px] lg:w-[17px]"
      style={{ boxShadow: "2px 2px 1px 1px rgb(209, 218, 218)" }}
    >
      {/* Top camera notch matching the laptop's notch */}
      <span className="z-20 h-0.5 w-2 shrink-0 rounded-b-[1px] bg-[#151722]" />

      {/* Modern bottom home indicator bar */}
      <span className="absolute bottom-[2px] z-20 h-[1px] w-2 rounded-full bg-[#151722]/40" />
    </div>
  );
}

export function LaptopFrame() {
  return (
    <div className="hero-device hero-device--laptop flex shrink-0 flex-col items-center">
      {/* Borderless screen */}
      <div
        className="relative flex h-[19px] w-[32px] justify-center overflow-hidden rounded-[2.5px] border-[1.8px] border-[#151722] bg-gray-50 sm:h-[22px] sm:w-[36px] lg:h-[25px] lg:w-[42px]"
        style={{ boxShadow: "2px 2px 1px 1px rgb(209, 218, 218)" }}
      >
        <span className="z-20 h-0.5 w-2 shrink-0 rounded-b-[1px] bg-[#151722]" />
      </div>

      {/* Base */}
      <div
        className="relative z-10 -mt-[1px] flex h-[3px] w-[38px] justify-center rounded-b-[2px] border-[1.8px] border-[#151722] bg-gray-200 sm:w-[44px] lg:w-[50px]"
        style={{ boxShadow: "2px 2px 1px 1px rgb(209, 218, 218)" }}
      >
        <span className="h-[1px] w-2.5 rounded-b-xs bg-[#151722]" />
      </div>
    </div>
  );
}