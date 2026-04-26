type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#D9D2C3] bg-[#F5F1EA] p-6">
      <h4 className="font-serif text-xl leading-tight tracking-tight">{title}</h4>
      <p className="text-sm leading-relaxed text-[#2A2A28]">{description}</p>
    </div>
  );
}
