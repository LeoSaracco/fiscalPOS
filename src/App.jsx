import { CatalogoProvider } from './context/CatalogoContext';
import { VentasProvider } from './context/VentasContext';
import { UIProvider } from './context/UIContext';
import { ConfigProvider } from './context/ConfigContext';
import TopBar from './components/Layout/TopBar';
import BottomNav from './components/Layout/BottomNav';
import PosPanel from './components/POS/PosPanel';
import Dashboard from './components/Dashboard/Dashboard';
import ProductosPanel from './components/Productos/ProductosPanel';
import StockPanel from './components/Stock/StockPanel';
import CajaPanel from './components/Caja/CajaPanel';
import VentasPanel from './components/Ventas/VentasPanel';
import NotasCreditoPanel from './components/NotasCredito/NotasCreditoPanel';
import ImportarPanel from './components/Importar/ImportarPanel';
import FiscalPanel from './components/Fiscal/FiscalPanel';
import ConfiguracionPanel from './components/Configuracion/ConfiguracionPanel';
import AuditoriaPanel from './components/Auditoria/AuditoriaPanel';
import TicketModal from './components/Modals/TicketModal';
import CierreZModal from './components/Modals/CierreZModal';
import StockMovModal from './components/Modals/StockMovModal';
import { useUI } from './context/UIContext';
import { useVentas } from './context/VentasContext';
import './index.css';

function MainContent() {
  const { activeTab, modals, modalData, openModal, closeModal } = useUI();
  const { state: ventasState, cierreZ } = useVentas();

  return (
    <main className="flex-1 p-4 pb-20 lg:pb-4 max-w-[1400px] w-full mx-auto">
      <div className={`section ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
        <Dashboard />
      </div>
      <div className={`section ${activeTab === 'pos' ? 'block' : 'hidden'}`}>
        <PosPanel />
      </div>
      <div className={`section ${activeTab === 'productos' ? 'block' : 'hidden'}`}>
        <ProductosPanel />
      </div>
      <div className={`section ${activeTab === 'stock' ? 'block' : 'hidden'}`}>
        <StockPanel />
      </div>
      <div className={`section ${activeTab === 'caja' ? 'block' : 'hidden'}`}>
        <CajaPanel />
      </div>
      <div className={`section ${activeTab === 'ventas' ? 'block' : 'hidden'}`}>
        <VentasPanel />
      </div>
      <div className={`section ${activeTab === 'notascredito' ? 'block' : 'hidden'}`}>
        <NotasCreditoPanel />
      </div>
      <div className={`section ${activeTab === 'importar' ? 'block' : 'hidden'}`}>
        <ImportarPanel />
      </div>
      <div className={`section ${activeTab === 'fiscal' ? 'block' : 'hidden'}`}>
        <FiscalPanel />
      </div>
      <div className={`section ${activeTab === 'config' ? 'block' : 'hidden'}`}>
        <ConfiguracionPanel />
      </div>
      <div className={`section ${activeTab === 'auditoria' ? 'block' : 'hidden'}`}>
        <AuditoriaPanel />
      </div>

      {modals.ticket && (
        <TicketModal
          onClose={() => closeModal('ticket')}
          ventaData={modalData}
        />
      )}
      {modals.cierreZ && (
        <CierreZModal
          onClose={() => closeModal('cierreZ')}
          onConfirm={cierreZ}
          cierreZData={ventasState.cierreZData}
        />
      )}
      {modals.stockMov && (
        <StockMovModal />
      )}
    </main>
  );
}

function App() {
  return (
    <ConfigProvider>
      <CatalogoProvider>
        <VentasProvider>
          <UIProvider>
            <div className="min-h-screen bg-bg text-text flex flex-col">
              <TopBar />
              <MainContent />
              <BottomNav />
            </div>
          </UIProvider>
        </VentasProvider>
      </CatalogoProvider>
    </ConfigProvider>
  );
}

export default App;
