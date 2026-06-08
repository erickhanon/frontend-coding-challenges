import { Divider } from "./Divider";
import { Grid } from "./Grid";
import { Item } from "./Item";

export const InfoSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold tracking-wide uppercase sm:text-2xl">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

InfoSection.Grid = Grid;
InfoSection.Item = Item;
InfoSection.Divider = Divider;
