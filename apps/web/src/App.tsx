import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { FarmDetail } from '@/pages/FarmDetail';
import { Calculator } from '@/pages/Calculator';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/farm/:id" element={<FarmDetail />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </Layout>
  );
}

export default App;
