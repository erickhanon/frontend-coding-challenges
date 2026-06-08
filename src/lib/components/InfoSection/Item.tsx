export const Item = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm tracking-wide text-amber-50/40 uppercase">{label}</p>
    <p className="mt-1 font-light tracking-wide uppercase">{value}</p>
  </div>
);
