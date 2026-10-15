export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3 border-b border-line pb-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">
          {index} — {kicker ?? "Section"}
        </p>
        <h2 className="font-display mt-2 text-4xl font-semibold md:text-5xl">{title}</h2>
      </div>
    </div>
  );
}
