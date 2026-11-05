import { InversionOfControlProvider } from '@/app/app.ioc.ts';
import { ProductCatalog } from '@/app/components/organisms/ProductCatalog/ProductCatalog.tsx';
import './App.css';

export function App() {
  return (
    <InversionOfControlProvider>
      <main className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4">
        <ProductCatalog />
      </main>
    </InversionOfControlProvider>
  );
}

export default App;
