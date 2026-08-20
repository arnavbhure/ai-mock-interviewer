export function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Subtle ambient lavender glow in center */}
      <div
        className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />
      {/* Very faint corner accents */}
      <div className="absolute top-0 left-0 h-[18rem] w-[18rem] rounded-full bg-primary/3 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[18rem] w-[18rem] rounded-full bg-primary/3 blur-3xl" />
    </div>
  );
}
