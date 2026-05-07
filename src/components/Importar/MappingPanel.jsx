export default function MappingPanel({ headers, mapping, onChange, campos }) {
  const handleChange = (i, val) => {
    if (onChange) onChange(i, val);
  };
  
  return (
    <div>
      {headers.map((h, i) => (
        <div key={i} className="flex items-center gap-2 mb-1.5 text-sm">
          <span className="min-w-[80px] sm:min-w-[120px] text-muted">{String(h)} →</span>
          <select
            value={mapping[i] || ''}
            onChange={e => handleChange(i, e.target.value)}
            className="flex-1"
          >
            <option value="">— Ignorar —</option>
            {campos.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
