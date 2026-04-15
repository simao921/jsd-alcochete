import { Card } from "./Card";

export function MemberCard({ member }) {
  return (
    <Card className="h-full overflow-hidden border-jsd-orange/12 p-0">
      <div className="space-y-5">
        <img src={member.photo} alt={member.name} className="h-72 w-full rounded-[1.5rem] object-cover" />
        <div className="space-y-5 px-6 pb-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-jsd-orange">{member.group}</p>
            <h3 className="font-display text-2xl font-bold text-jsd-blue-dark dark:text-white">{member.name}</h3>
            <p className="text-sm font-semibold text-jsd-blue-dark dark:text-jsd-orange">{member.role}</p>
          </div>
          <p className="copy text-sm">{member.bio}</p>
        </div>
      </div>
    </Card>
  );
}
