export default function StockCards({ stats }) {
  const cards = [
    { label: 'TOTAL PRODUCTOS', value: stats.total, color: 'text-text' },
    { label: 'EN OK', value: stats.ok, color: 'text-green-500' },
    { label: 'BAJO STOCK', value: stats.bajo, color: 'text-amber-500' },
    { label: 'SIN STOCK', value: stats.vacio, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {cards.map((card, i) => (
        <div key={i} className="card p-3 text-center">
          <div className="text-xs text-muted uppercase">{card.label}</div>
          <div className={`text-2xl font-extrabold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
