import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

// ─── IMAGE CARDS (Your images - transparent backgrounds)
const ImageCard1 = () => (
  <div className="w-full h-full rounded-[0px] overflow-hidden relative select-none bg-transparent">
    <img
      src="/images/Apcard 5 white 1.png"
      alt="Card design 1"
      className="h-full w-full object-contain"
    />
  </div>
);

const ImageCard2 = () => (
  <div className="w-full h-full rounded-[0px] overflow-hidden relative select-none bg-transparent">
    <img
      src="/images/Blackcard3.png"
      alt="Card design 2"
      className="h-full w-full object-contain"
    />
  </div>
);

const ImageCard3 = () => (
  <div className="w-full h-full rounded-[0px] overflow-hidden relative select-none bg-transparent">
    <img
      src="/images/pink card 3.png"
      alt="Card design 3"
      className="h-full w-full object-contain"
    />
  </div>
);

// ─── CARD COLLECTION
const CARDS = [
  { id: "image1", component: ImageCard1 },
  { id: "image2", component: ImageCard2 },
  { id: "image3", component: ImageCard3 },
];

// ─── SmartCardStack
const CARD_W = 300;
const CARD_H = 189;
const STACK_W = 200;
const STACK_H = 126;

const SmartCardStack = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [doneIdxs, setDoneIdxs] = useState<number[]>([]);
  const nextCard = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const run = () => {
      const idx = nextCard.current;
      setActiveIdx(idx);

      const t1 = setTimeout(() => {
        setDoneIdxs((prev) => [...prev, idx]);
        setActiveIdx(-1);

        const t2 = setTimeout(() => {
          nextCard.current = (nextCard.current + 1) % CARDS.length;
          if (nextCard.current === 0) setDoneIdxs([]);
          const t3 = setTimeout(run, 500);
          timers.current.push(t3);
        }, 600);
        timers.current.push(t2);
      }, 2000);
      timers.current.push(t1);
    };

    const init = setTimeout(run, 1000);
    timers.current.push(init);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0"
      style={{ width: "100%", maxWidth: 560, height: "auto", minHeight: 280 }}
    >
      {/* ── Preview slot (Big card) ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: CARD_W, height: CARD_H + 60 }}
      >
        {activeIdx >= 0 &&
          (() => {
            const Component = CARDS[activeIdx].component;
            return (
              <div
                key={`preview-${CARDS[activeIdx].id}`}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 20,
                  overflow: "hidden",
                  top: 30,
                  left: 0,
                  boxShadow: "none",
                  background: "transparent",
                }}
              >
                <Component />
              </div>
            );
          })()}

        {/* Ground shadow under preview - made lighter */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "10%",
            right: "10%",
            height: 18,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.1)",
            filter: "blur(10px)",
            pointerEvents: "none",
            opacity: activeIdx >= 0 ? 0.15 : 0,
            transform: `scaleX(${activeIdx >= 0 ? 1 : 0.5})`,
          }}
        />
      </div>
      {/* ── Stack (Small cards) ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: STACK_W + 20, height: STACK_H + 40, marginTop: 20 }}
      >
        {CARDS.map((card, i) => {
          if (i === activeIdx) return null;
          const isDone = doneIdxs.includes(i);
          const stackRank = isDone
            ? CARDS.length
            : CARDS.length - 1 - i + doneIdxs.filter((d) => d < i).length;
          const offset = stackRank * 4;
          const Component = card.component;

          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                width: STACK_W,
                height: STACK_H,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "none",
                top: 20,
                left: 0,
                background: "transparent",
                transform: `translate(${isDone ? offset + 2 : offset}px, ${isDone ? -offset * 0.3 + 2 : -offset * 0.3}px) rotate(${isDone ? offset * 0.5 - 1 : offset * 0.5}deg) scale(${1 - stackRank * 0.018})`,
                zIndex: isDone ? 0 : CARDS.length - stackRank,
              }}
            >
              <Component />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Floating badge with different colors
const FloatingBadge = ({
  label,
  delay,
  className,
  variant = "default",
}: {
  label: string;
  delay: number;
  className: string;
  variant?: "default" | "accent" | "dark" | "light";
}) => {
  const variants = {
    default: {
      bg: "bg-white",
      border: "border-[#5D2D2B]/12",
      text: "text-[#5D2D2B]",
    },
    accent: {
      bg: "bg-[#FED45C]",
      border: "border-[#5D2D2B]/20",
      text: "text-[#5D2D2B]",
    },
    dark: {
      bg: "bg-[#5D2D2B]",
      border: "border-[#FEF4EA]/20",
      text: "text-[#FEF4EA]",
    },
    light: {
      bg: "bg-[#FEF4EA]",
      border: "border-[#5D2D2B]/10",
      text: "text-[#5D2D2B]",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`absolute flex items-center gap-1.5 ${style.bg} border ${style.border}
                  px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.08)] ${className}`}
    >
      <span
        className={`text-[10px] font-black ${style.text} whitespace-nowrap`}
      >
        {label}
      </span>
    </div>
  );
};

// ─── Main Section
export const CustomNfcCardSection = () => (
  <section className="relative w-full bg-white py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
    <img
      src="/images/scribble.svg"
      alt=""
      width={240}
      height={240}
      className="pointer-events-none absolute rotate-45 -left-16 opacity-40 top-0 w-[7rem] sm:w-[9rem] md:w-[12rem] lg:w-[14rem]"
    />
    <img
      src="/images/scribble.svg"
      alt=""
      width={240}
      height={240}
      className="pointer-events-none absolute -rotate-45 -right-12 opacity-40 top-8 w-[7rem] sm:w-[9rem] md:w-[12rem] lg:w-[14rem]"
    />

    <div className="container mx-auto">
      {/* Main content wrapper - flex column on mobile */}
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-40">
        {/* Card Stack & Write-up row (reordered for mobile) */}
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-40 items-center">
          {/* Card Stack Column */}
          <div className="flex justify-center items-center order-1 md:order-1 relative overflow-visible w-full">
            <div className="relative overflow-visible w-full flex justify-center">
              <SmartCardStack />
              {/* Floating badges */}
              <FloatingBadge
                label="Tap to share"
                variant="accent"
                delay={0}
                className="-top-2 right-2 md:right-0"
              />
              <FloatingBadge
                label="No app needed"
                variant="dark"
                delay={1}
                className="bottom-2 right-2 md:right-0"
              />
              <FloatingBadge
                label="Fully custom"
                variant="light"
                delay={0.5}
                className="bottom-2 -left-2 md:-left-2"
              />
            </div>
          </div>

          {/* Write-up Column */}
          <div className="flex flex-col gap-4 sm:gap-5 text-center md:text-left order-2 md:order-2 w-full">
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-[#5D2D2B] mb-2 sm:mb-3">
                Your digital identity now in your pockets.
              </p>
              <h2 className="text-[35px] sm:text-[40px] lg:text-[50px] trialheader leading-[0.9] sm:leading-none font-[400] text-[#5D2D2B]">
                Get the Acard
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-left font-light leading-5 sm:leading-6 -mb-2 md:mb-0 text-[#5D2D2B]/80 max-w-sm mx-auto md:mx-0 px-2 sm:px-0">
              Personalize your NFC Acard with your name, logo, and brand style.
              One tap shares your Abio no app needed.
            </p>
          </div>
        </div>

        {/* ─── Button row - MOBILE: centered, DESKTOP: left-aligned ─── */}
        <div className="flex justify-center md:justify-start w-full md:mt-0">
          <Link to="/store" className="md:w-auto">
            <button className="bg-[#FED45C] shadow-[3px_3px_0px_0px_#000000] text-[#5D2D2B] h-10 sm:h-12 px-6 sm:px-8 font-bold text-xs sm:text-sm transition-shadow duration-200 cursor-pointer w-full md:w-auto">
              Order your Acard
            </button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CustomNfcCardSection;
