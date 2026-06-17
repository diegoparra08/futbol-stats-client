
interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const currentStatus = status?.toLowerCase();

  if (currentStatus === "inplay") {
    return (
      <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/20 uppercase animate-pulse">
        ⚡ En Vivo
      </span>
    );
  }

  if (currentStatus === "scheduled") {
    return (
      <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-500/20 uppercase">
        ⏳ Programado
      </span>
    );
  }

  if (currentStatus === "cancelled") {
    return (
      <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold border border-rose-500/20 uppercase">
        🚫 Cancelado
      </span>
    );
  }

  return (
    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-500/20 uppercase">
      ✅ Finalizado
    </span>
  );
}