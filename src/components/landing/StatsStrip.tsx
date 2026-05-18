const stats = [
  { number: "12K+", label: "ASHA workers active" },
  { number: "84K",  label: "Referrals generated" },
  { number: "98%",  label: "Query accuracy rate" },
  { number: "6",    label: "States covered" },
];

export default function StatsStrip() {
  return (
    <div className="bg-teal-600 py-12 px-8">
      <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center relative">
            {i > 0 && (
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/15" />
            )}
            <p className="font-serif text-[48px] text-white leading-none mb-1.5">{s.number}</p>
            <p className="text-[14px] text-teal-100">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
