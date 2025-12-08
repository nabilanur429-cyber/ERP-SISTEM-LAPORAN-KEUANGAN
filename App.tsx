import React, { useState } from 'react';
import Layout from './components/Layout';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import ErpDashboard from './components/ErpDashboard';
import { ViewMode } from './types';

function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>(ViewMode.ARCHITECT);

  return (
    <Layout currentMode={currentMode} onModeChange={setCurrentMode}>
      {currentMode === ViewMode.ARCHITECT ? (
        <DocumentAnalyzer />
      ) : (
        <ErpDashboard />
      )}
    </Layout>
  );
}

export default App;
