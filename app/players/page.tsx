
import PlayerList from "@/components/playerList";

export default function PlayersPage() {
  // El servidor ya no hace fetch, solo dibuja el componente cliente vacío al inicio
  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-3xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
        🏃‍♂️ Plantilla de Jugadores
      </h1>
      {/* Le pasamos un array vacío inicial */}
      <PlayerList initialPlayers={[]} />
    </main>
  );
}