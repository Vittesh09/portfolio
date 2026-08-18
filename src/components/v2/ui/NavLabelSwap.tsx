type NavLabelSwapProps = {
  short: string;
  long: string;
};

export function NavLabelSwap({ short, long }: NavLabelSwapProps) {
  return (
    <span className="v2-nav-label-swap">
      <span className="v2-nav-label-swap-default">{short}</span>
      <span className="v2-nav-label-swap-hover">{long}</span>
    </span>
  );
}
