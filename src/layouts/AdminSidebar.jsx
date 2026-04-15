import { cn } from "../services/helpers";

export function AdminSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "news", label: "Notícias" },
    { id: "events", label: "Eventos" },
    { id: "team", label: "Equipa" },
    { id: "members", label: "Membros" },
    { id: "requests", label: "Pedidos" }
  ];

  return (
    <aside className="surface-panel h-fit overflow-hidden p-0">
      <div className="bg-jsd-orange px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">Admin panel</p>
      </div>
      <div className="grid gap-2 p-4">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
              activeSection === section.id
                ? "bg-jsd-orange text-white"
                : "bg-[#fff8ef] text-jsd-blue-dark hover:bg-[#fff1d6] dark:bg-white/5 dark:text-white"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
