import React, { useState } from 'react';
import { TabId, VideoCourse } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { VideosSection } from './components/VideosSection';
import { HybridCalculator } from './components/HybridCalculator';
import { InterestCalculator } from './components/InterestCalculator';
import { ScheduleTraining } from './components/ScheduleTraining';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { FotusLogo } from './components/FotusLogo';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [course, setCourse] = useState<VideoCourse | null>(null);
  const selectTab = (tab: TabId) => { setCurrentTab(tab); setMobileMenuOpen(false); setSearchQuery(''); };
  const handleSearch = (query: string) => { setSearchQuery(query); if (query.trim()) setCurrentTab('cursos'); };
  return <div className="min-h-screen bg-[#EEF4FA] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
    <div className="lg:hidden bg-white/95 border border-slate-200 rounded-full mx-3 mt-3 px-3 py-2 flex items-center justify-between sticky top-3 z-40 shadow-sm"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Abrir menu" aria-expanded={mobileMenuOpen} className="p-2 rounded-full text-slate-600">{mobileMenuOpen ? <X /> : <Menu />}</button><FotusLogo className="h-10 w-auto" /><div className="w-10" /></div>
    <div className="flex min-h-screen">
      <div className="hidden lg:block shrink-0"><Sidebar currentTab={currentTab} onSelectTab={selectTab} /></div>
      {mobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden flex"><button className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} /><div className="relative z-10 h-full"><Sidebar currentTab={currentTab} onSelectTab={selectTab} mobile /></div></div>}
      <div className="flex-1 min-w-0">
        <Header searchQuery={searchQuery} onSearchChange={handleSearch} onSelectTab={selectTab} />
        <main className="max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <Dashboard onSelectTab={selectTab} onPlayCourse={setCourse} />}
          {currentTab === 'cursos' && <VideosSection onPlayCourse={setCourse} searchFilter={searchQuery} />}
          <div hidden={currentTab !== 'hibrido'}><HybridCalculator /></div>
          <div hidden={currentTab !== 'juros'}><InterestCalculator /></div>
          {currentTab === 'agendamento' && <ScheduleTraining />}
        </main>
      </div>
    </div>
    {course && <VideoPlayerModal course={course} onClose={() => setCourse(null)} />}
  </div>;
}
