import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

export default function DropZone({ onFileLoaded }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.match(/\.(xls|xlsx|csv)$/i)) return alert('Formato no soportado');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = jsonData[0] || [];
      onFileLoaded(jsonData, headers);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
      }}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border hover:border-blue-500/50'
      }`}
    >
      <div className="text-4xl mb-2">📂</div>
      <div>Arrastrá un archivo aquí o hacé clic para elegir</div>
      <div className="text-xs text-muted mt-1">.xlsx · .xls · .csv</div>
      <input
        ref={inputRef}
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={(e) => processFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
