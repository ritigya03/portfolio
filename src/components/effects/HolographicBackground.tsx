export function HolographicBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden grain"
    >
      <div className="absolute -left-[15%] -top-[15%] h-[60vw] w-[60vw] rounded-full bg-lavender opacity-50 blur-[90px] animate-drift" />
      <div className="absolute -right-[10%] bottom-[5%] h-[50vw] w-[50vw] rounded-full bg-mint opacity-45 blur-[100px] animate-drift [animation-delay:-3s]" />
      <div className="absolute right-[20%] top-[35%] h-[38vw] w-[38vw] rounded-full bg-blush opacity-60 blur-[90px] animate-drift [animation-delay:-6s]" />
      <div className="absolute left-[25%] bottom-[25%] h-[30vw] w-[30vw] rounded-full bg-periwinkle opacity-35 blur-[110px] animate-drift [animation-delay:-9s]" />
    </div>
  );
}
