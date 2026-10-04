import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  FileText, 
  Settings, 
  Coffee, 
  Thermometer, 
  Droplets, 
  Smartphone, 
  Download, 
  RefreshCw, 
  ChevronRight, 
  Menu, 
  X 
} from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Overview');

  // Data Log Terbaru
  const recentLogs = [
    { time: '2026-08-04 13:46:12', session: '#DAQ-2026-1004', pred: 'Arabica', conf: '94.2%', color: 'text-emerald-600' },
    { time: '2026-08-04 13:45:37', session: '#DAQ-2026-1004', pred: 'Robusta', conf: '89.7%', color: 'text-blue-600' },
    { time: '2026-08-04 13:44:58', session: '#DAQ-2026-1003', pred: 'Arabica', conf: '92.5%', color: 'text-emerald-600' },
    { time: '2026-08-04 13:43:21', session: '#DAQ-2026-1003', pred: 'Liberica', conf: '87.3%', color: 'text-amber-600' },
    { time: '2026-08-04 13:42:05', session: '#DAQ-2026-1002', pred: 'Excelsa', conf: '85.6%', color: 'text-purple-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* --- SIDEBAR (Responsive Drawer untuk Mobile & Fixed untuk Desktop) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
      `}>
        <div>
          {/* Logo Brand */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-wide">CoffeeSense IoT</h1>
                <p className="text-xs text-slate-400">Smart Coffee Classification</p>
              </div>
            </div>
            <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigasi Menu */}
          <nav className="space-y-1">
            {[
              { name: 'Overview', icon: LayoutDashboard },
              { name: 'Sensor Analytics', icon: LineChart },
              { name: 'Device Logs', icon: FileText },
              { name: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveMenu(item.name); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar (Dekorasi teks & ilutrasi kopi tipis) */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 hidden md:block">
          <p className="font-semibold text-slate-400">Better Beans</p>
          <p>with Smarter Data</p>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Coffee className="w-6 h-6 text-indigo-600 hidden sm:block" />
                <h2 className="text-xl font-bold text-slate-900">Coffee Classification & Monitoring</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">Real-time coffee type detection using ESP32-S3 + Edge Impulse • Connected to Azure IoT</p>
            </div>
          </div>

          {/* Tombol Aksi Kanan */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ESP32-S3 Connected
            </span>
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition shadow-sm">
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition shadow-md shadow-indigo-600/20">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body / Grid Content */}
        <div className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* Baris 1: Kartu Metrik Ringkasan (Responsive Grid: 1 kolom di HP, 2 di tablet, 4 di desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Kartu 1: Latest Prediction */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative group hover:border-indigo-300 transition">
              <div>
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Latest Prediction</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Coffee className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">Arabica</div>
                <div className="text-xs text-slate-500">Confidence</div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600">94.2%</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition" />
              </div>
            </div>

            {/* Kartu 2: Environment Temperature */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative group hover:border-indigo-300 transition">
              <div>
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Environment Temperature</span>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Thermometer className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">28.5 °C</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  ▲ +0.3°C <span className="text-slate-400 font-normal">(vs. previous)</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition" />
              </div>
            </div>

            {/* Kartu 3: Air Humidity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative group hover:border-indigo-300 transition">
              <div>
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Air Humidity</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Droplets className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">65.0 %</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  ▲ +1.2% <span className="text-slate-400 font-normal">(vs. previous)</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition" />
              </div>
            </div>

            {/* Kartu 4: Active Measurement Session */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between relative group hover:border-indigo-300 transition">
              <div>
                <div className="flex items-center justify-between text-slate-500 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider">Active Measurement Session</span>
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-lg font-extrabold text-slate-900 mb-1">#DAQ-2026-1004</div>
                <div className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Running
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition" />
              </div>
            </div>

          </div>

          {/* Baris 2: Grafik Sensor Gas Real-time & Recent Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Kolom Kiri-Tengah: Grafik Sensor (Memakan 2 kolom di layar besar) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sensor Gas Readings (Real-time)</h3>
                  <p className="text-xs text-slate-400">Monitoring level gas MQ & TGS series</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Last 5 Minutes</option>
                  <option>Last 15 Minutes</option>
                  <option>Last 1 Hour</option>
                </select>
              </div>

              {/* Area Grafik Mockup (Visualisasi SVG Garis Tren Gas) */}
              <div className="relative h-64 sm:h-72 w-full flex items-center justify-center border-b border-slate-100">
                {/* Garis Grid Horizontal */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  {[0, 200, 400, 600, 800, 1000].map((val, i) => (
                    <div key={i} className="border-b border-slate-100 w-full flex items-center text-[10px] text-slate-400 justify-between">
                      <span className="pr-2">{val}</span>
                      <span className="w-full border-t border-dashed border-slate-100"></span>
                    </div>
                  ))}
                </div>

                {/* SVG Garis Sensor */}
                <svg className="absolute inset-0 w-full h-full overflow-visible px-4" preserveAspectRatio="none" viewBox="0 0 600 200">
                  {/* Garis Biru: CO2 */}
                  <path d="M 0 120 Q 100 110, 200 90 T 400 70 T 600 50" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                  {/* Garis Kuning/Oranye: VOC */}
                  <path d="M 0 150 Q 100 140, 200 125 T 400 100 T 600 90" fill="none" stroke="#d97706" strokeWidth="2.5" />
                  {/* Garis Hijau: NH3 */}
                  <path d="M 0 170 Q 100 165, 200 160 T 400 155 T 600 150" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                  {/* Garis Ungu: C6H6 */}
                  <path d="M 0 185 Q 100 183, 200 180 T 400 175 T 600 173" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Sumbu X & Keterangan Warna Sensor (Legend) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3 text-xs">
                <div className="flex items-center justify-between w-full sm:w-auto text-slate-400 text-[11px]">
                  <span>13:42</span>
                  <span className="hidden sm:inline">13:43</span>
                  <span>13:44</span>
                  <span className="hidden sm:inline">13:45</span>
                  <span>13:46</span>
                  <span>13:47</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span><span className="text-slate-600">CO₂ (ppm)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-600">VOC (ppm)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span><span className="text-slate-600">NH₃ (ppm)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span><span className="text-slate-600">C₆H₆ (ppm)</span></div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Recent Logs (Memakan 1 kolom) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-900 mb-4">Recent Logs</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold">Waktu</th>
                      <th className="pb-3 font-semibold">Sesi</th>
                      <th className="pb-3 font-semibold">Prediksi</th>
                      <th className="pb-3 font-semibold">Confidence</th>
                      <th className="pb-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition group cursor-pointer">
                        <td className="py-3.5 text-slate-600 whitespace-nowrap">{log.time}</td>
                        <td className="py-3.5 font-medium text-slate-800 whitespace-nowrap">{log.session}</td>
                        <td className="py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-medium">
                            <Coffee className="w-3.5 h-3.5 text-indigo-600" />
                            {log.pred}
                          </span>
                        </td>
                        <td className={`py-3.5 font-bold ${log.color} whitespace-nowrap`}>{log.conf}</td>
                        <td className="py-3.5 text-slate-300 group-hover:text-indigo-600 text-right">
                          <ChevronRight className="w-4 h-4 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}