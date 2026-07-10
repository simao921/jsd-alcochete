import { Card } from "./Card";

export function MemberCard({ member }) {
  return (
    <Card className="h-full overflow-hidden border-jsd-orange/15 p-0 group hover:border-jsd-orange/30 transition-colors duration-300">
      <div className="space-y-0">
        <div className="relative overflow-hidden">
          <img
            src={member.photo}
            alt={member.name}
            className="h-72 w-full rounded-t-2xl object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0703] via-transparent to-transparent opacity-60" />
        </div>
        <div className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-jsd-orange">{member.group}</p>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">{member.name}</h3>
            <p className="text-sm font-semibold text-jsd-orange/90">{member.role}</p>
          </div>
          <p className="text-sm leading-relaxed text-white/65">{member.bio}</p>
        </div>
      </div>
    </Card>
  );
}
