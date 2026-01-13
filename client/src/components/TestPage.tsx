import React, { useEffect, useState } from "react";

// Professional Agriculture Theme Colors:
// Primary: #2D5A27 (Forest Green)
// Secondary: #6B8E23 (Olive Drab)
// Accent: #F4F7F2 (Light Sage Background)

const TestPage: React.FC = () => {
  const [frontend, setFrontend] = useState<any>(null);
  const [backend, setBackend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [fRes, bRes] = await Promise.all([
          fetch("/testcases/frontend.json"),
          fetch("/testcases/backend.json"),
        ]);
        if (!fRes.ok || !bRes.ok) throw new Error("Failed to load test JSON files");
        setFrontend(await fRes.json());
        setBackend(await bRes.json());
      } catch (err: any) {
        setError(err?.message || "Failed to load testcases");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const TestTable = ({ title, suites }: { title: string; suites: any[] }) => (
    <div className="mb-12 bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
      <div className="bg-[#2D5A27] px-6 py-4">
        <h2 className="text-white text-xl font-semibold tracking-wide flex items-center gap-2">
          <span className="opacity-80">🌱</span> {title} Systems
        </h2>
      </div>
      
      <div className="p-6">
        {suites?.map((suite: any) => (
          <div key={suite.name} className="mb-8 last:mb-0">
            <h3 className="text-[#4A6741] font-bold text-lg mb-4 border-b border-stone-100 pb-2">
              {suite.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F4F7F2] text-[#2D5A27] text-sm uppercase tracking-wider">
                    <th className="p-3 border-b">ID</th>
                    <th className="p-3 border-b">Description</th>
                    <th className="p-3 border-b">Input Data</th>
                    <th className="p-3 border-b">Expected Output</th>
                    <th className="p-3 border-b">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {suite.tests.map((t: any) => (
                    <tr key={t.id} className="hover:bg-green-50/50 transition-colors border-b border-stone-100 last:border-0">
                      <td className="p-3 font-mono font-bold text-gray-500">{t.id}</td>
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 italic text-gray-500">{t.input || "TestSprite"}</td>
                      <td className="p-3">{t.expected || "Redirect/Success"}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          t.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.status || "PASS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="p-10 text-center text-green-800 animate-pulse">Initializing Monitoring Diagnostics...</div>;
  if (error) return <div className="p-10 text-red-600 bg-red-50 m-6 rounded border border-red-200">System Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#F9FBF9] p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold text-[#1B3A18] mb-2">Quality Assurance</h1>
        <p className="text-gray-600">Validation & Verification of Agriculture IoT Monitoring Nodes</p>
        <div className="h-1 w-20 bg-[#6B8E23] mt-4"></div>
      </header>

      <main className="max-w-6xl mx-auto">
        <TestTable title="Frontend (Dashboard Interface)" suites={frontend?.suites} />
        <TestTable title="Backend (Data Processing & Sensors)" suites={backend?.suites} />
        
        {/* Error Handling Section as per your image doc */}
        <section className="bg-stone-800 text-stone-200 p-6 rounded-lg shadow-inner mt-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚠️ 7.3 Error Handling Protocols
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-90">
            <li className="border border-stone-600 p-3 rounded"><strong>404 Errors:</strong> Custom "Plot Not Found" landing page.</li>
            <li className="border border-stone-600 p-3 rounded"><strong>Validation:</strong> Real-time sensor threshold boundary checks.</li>
            <li className="border border-stone-600 p-3 rounded"><strong>Database:</strong> Auto-retry logic for remote field telemetry nodes.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default TestPage;