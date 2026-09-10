export function Loader() {
  return (
    <>
      <style>{`
        @keyframes abio-beam {
          0% {
            opacity: 0.7;
            transform: scale(0.82);
            filter: drop-shadow(0 0 0 rgba(254, 212, 92, 0));
          }
          30% {
            opacity: 1;
            transform: scale(1);
            filter: drop-shadow(0 0 18px rgba(254, 212, 92, 0.55));
          }
          60% {
            opacity: 0.9;
            transform: scale(1.08);
            filter: drop-shadow(0 0 28px rgba(254, 212, 92, 0.7));
          }
          100% {
            opacity: 0.7;
            transform: scale(0.82);
            filter: drop-shadow(0 0 0 rgba(254, 212, 92, 0));
          }
        }

        @keyframes abio-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5EEE4] dark:bg-[#1C1611]">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-[#FED45C]/30 blur-2xl animate-[abio-glow_1.8s_ease-in-out_infinite]" />
          <img
            src="/Abio-logo.png"
            alt="Loading"
            className="relative h-16 w-16 object-contain animate-[abio-beam_1.8s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </>
  );
}

export default Loader;
