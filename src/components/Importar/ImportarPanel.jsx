import { useState } from 'react';
import DropZone from './DropZone';
import MappingPanel from './MappingPanel';
import * as XLSX from 'xlsx';
import { useCatalogo } from '../../context/CatalogoContext';
import { fmt } from '../../utils/format';

export default function ImportarPanel() {
  const { addProducto } = useCatalogo();
  const [step, setStep] = useState(1);
  const [importData, setImportData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [previewRows, setPreviewRows] = useState([]);
  const [result, setResult] = useState(null);

  const handleFileLoaded = (data, hdrs) => {
    setImportData(data);
    setHeaders(hdrs);
    setStep(2);
    // Auto-mapping
    const autoMap = {};
    hdrs.forEach((h, i) => {
      const hl = String(h).toLowerCase();
      if (hl.includes('cod') || hl.includes('sku')) autoMap[i] = 'sku';
      else if (hl.includes('desc') || hl.includes('producto') || hl.includes('nombre')) autoMap[i] = 'nombre';
      else if (hl.includes('precio') || hl.includes('importe')) autoMap[i] = 'precio';
      else if (hl.includes('iva')) autoMap[i] = 'iva';
      else if (hl.includes('stock') && !hl.includes('min')) autoMap[i] = 'stock';
      else if (hl.includes('min')) autoMap[i] = 'stockMin';
      else if (hl.includes('cat')) autoMap[i] = 'categoria';
      else if (hl.includes('tipo')) autoMap[i] = 'tipo';
    });
    setMapping(autoMap);
  };

  const handlePreview = () => {
    const rows = importData.slice(1).filter(r => r.some(c => c));
    setPreviewRows(rows);
    setStep(3);
  };

  const handleConfirm = async () => {
    const rows = importData.slice(1).filter(r => r.some(c => c));
    let success = 0;
    let errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const producto = {};
        Object.entries(mapping).forEach(([colIdx, field]) => {
          const val = row[colIdx];
          if (field === 'precio' || field === 'stock' || field === 'stockMin') {
            producto[field] = parseFloat(val) || 0;
          } else if (field === 'iva') {
            producto[field] = parseFloat(val) || 21;
          } else if (field === 'tipo') {
            producto.esCombo = String(val).toLowerCase().includes('combo');
          } else {
            producto[field] = String(val || '').trim();
          }
        });

        if (!producto.sku || !producto.nombre) {
          errors.push(`Fila ${i + 2}: Falta SKU o nombre`);
          continue;
        }
        if (!producto.precio) {
          errors.push(`Fila ${i + 2}: Falta precio`);
          continue;
        }

        producto.iva = producto.iva || 21;
        producto.stock = producto.stock || 0;
        producto.stockMin = producto.stockMin || 0;
        producto.categoria = producto.categoria || 'General';
        producto.esCombo = producto.esCombo || false;

        await addProducto(producto);
        success++;
      } catch (err) {
        errors.push(`Fila ${i + 2}: ${err.message}`);
      }
    }

    setResult({ success, errors, total: rows.length });
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setImportData([]);
    setHeaders([]);
    setMapping({});
    setPreviewRows([]);
    setResult(null);
  };

  const campos = [
    { key: 'sku', label: 'SKU (código)' },
    { key: 'nombre', label: 'Descripción' },
    { key: 'precio', label: 'Precio con IVA' },
    { key: 'iva', label: 'Alícuota IVA' },
    { key: 'stock', label: 'Stock actual' },
    { key: 'stockMin', label: 'Stock mínimo' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'tipo', label: 'Tipo (simple/combo)' }
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📥 Importar Stock desde XLS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* Steps */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {[1,2,3,4].map(s => (
              <div key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  s === step ? 'border-blue-500 text-blue-500 bg-blue-500/10' :
                  s < step ? 'border-green-500 bg-green-500 text-white' :
                  'border-dim text-muted'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <DropZone onFileLoaded={handleFileLoaded} />
              <button onClick={() => {
                // Download template
                const datos = [['codigo','descripcion','precio_con_iva','iva_pct','stock_actual','stock_minimo','categoria','tipo']];
                const ws = XLSX.utils.aoa_to_sheet(datos);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Productos');
                XLSX.writeFile(wb, 'plantilla_fiscalpos.xlsx');
              }} className="btn btn-outline btn-sm mt-2">⬇ Descargar plantilla</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="font-bold mb-3">Mapear columnas</div>
              <MappingPanel 
                headers={headers} 
                mapping={mapping} 
                onChange={(i, val) => setMapping(prev => ({ ...prev, [i]: val }))} 
                campos={campos} 
              />
              <button onClick={handlePreview} className="btn btn-primary btn-sm mt-3">Continuar →</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="font-bold mb-3">Preview de datos</div>
              <div className="text-sm mb-2">✓ {previewRows.length} filas encontradas</div>
              <div className="max-h-[300px] overflow-auto card p-0">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      {campos.filter(c => Object.values(mapping).includes(c.key)).map(c => (
                        <th key={c.key} className="p-2 text-left">{c.label}</th>
                      ))}
                      <th className="p-2 text-left">EST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 10).map((r, i) => (
                      <tr key={i} className="border-t border-border">
                        {campos.filter(c => Object.values(mapping).includes(c.key)).map(c => (
                          <td key={c.key} className="p-2">
                            {r[Object.keys(mapping).find(k => mapping[k] === c.key)] || '???'}
                          </td>
                        ))}
                        <td className="p-2">
                          {r[mapping.sku] ? '✓' : '⚠'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleConfirm} className="btn btn-primary btn-sm mt-3">✓ Importar</button>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className={`text-lg font-bold mb-2 ${result.errors.length ? 'text-amber-500' : 'text-green-500'}`}>
                {result.errors.length ? '⚠ Importación completada con errores' : '✓ Importación completada'}
              </div>
              <div className="text-sm mb-2">
                <span className="text-green-500 font-bold">{result.success}</span> productos importados correctamente
                {result.errors.length > 0 && (
                  <span> · <span className="text-amber-500 font-bold">{result.errors.length}</span> errores</span>
                )}
              </div>
              {result.errors.length > 0 && (
                <div className="card bg-amber-500/10 border-amber-500/30 max-h-32 overflow-y-auto mb-3">
                  <div className="text-xs font-semibold text-amber-500 mb-1">Errores:</div>
                  {result.errors.map((err, i) => (
                    <div key={i} className="text-xs text-amber-400">{err}</div>
                  ))}
                </div>
              )}
              <button onClick={reset} className="btn btn-outline btn-sm">Nueva importación</button>
            </div>
          )}
        </div>

        {/* Right: Documentation */}
        <div>
          <div className="card text-sm leading-relaxed">
            <div className="font-bold mb-2">Formato esperado</div>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="p-1 text-left">Columna</th>
                  <th className="p-1 text-left">Campo</th>
                  <th className="p-1 text-left">Requerido</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A', 'código (SKU)', '✓'],
                  ['B', 'descripción', '✓'],
                  ['C', 'precio_con_iva', '✓'],
                  ['D', 'iva_pct', '✓'],
                  ['E', 'stock_actual', '✓'],
                  ['F', 'stock_minimo', ''],
                  ['G', 'categoría', ''],
                  ['H', 'tipo (simple/combo)', '']
                ].map(([col, campo, req]) => (
                  <tr key={col} className="border-t border-border">
                    <td className="p-1">{col}</td>
                    <td className="p-1">{campo}</td>
                    <td className="p-1">{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
