type DashboardHeaderProps = {
  name: string;
};

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-heading-2 text-text">
        {greeting}, {name}
      </h1>
      <p className="text-body-lg text-text-secondary">Ready for your next interview?</p>
      <p className="text-body-sm text-text-muted">
        Continue practicing or start a new interview tailored to your target role.
      </p>
    </div>
  );
}