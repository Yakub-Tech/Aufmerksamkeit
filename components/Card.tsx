type CardProps = {
  title: string;
  description: string;
};

export default function Card({ title, description }: CardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#D7DAE4] bg-[#F4F5F8] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#3F4A78]">
      <h4 className="font-serif text-xl leading-tight tracking-tight">{title}</h4>
      <p className="text-sm leading-relaxed text-[#2A2A28]">{description}</p>
    </div>
  );
}
