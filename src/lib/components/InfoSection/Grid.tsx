export const Grid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2">{children}</div>
);
