type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#A970FF]">
        {eyebrow}
      </p>

      <h2 className="font-display mt-4 text-4xl font-semibold text-[#3B1E5A] md:text-5xl">
        {title}
      </h2>
    </div>
  );
}