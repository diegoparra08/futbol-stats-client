"use client";


interface StatSliderProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}

export default function StatSlider({ label, value, onChange }: StatSliderProps) {
  // Función para determinar el color del texto del número dinámicamente
  const getColorClass = (val: number) => {
    if (val < 60) return "text-red-500 font-bold";
    if (val < 80) return "text-yellow-500 font-bold";
    return "text-emerald-500 font-bold";
  };

  return (
    <div className="flex flex-col gap-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800/50">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-300 font-medium capitalize">{label}</span>
        {/* Valor en numero texto dinámico */}
        <span className={`text-base tracking-wider ${getColorClass(value)}`}>
          {value}
        </span>
      </div>
      
      <input
        type="range"
        min="0"
        max="99"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
      />
    </div>
  );
}