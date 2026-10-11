import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KpiSummary from './components/KpiSummary';
import DistribusiJenis from './components/DistribusiJenis';
import BidangAnalysis from './components/BidangAnalysis';
import NameLength from './components/NameLength';
import DataTable from './components/DataTable';
import Conclusions from './components/Conclusions';
import Sources from './components/Sources';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#ringkasan">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <KpiSummary />
        <DistribusiJenis />
        <BidangAnalysis />
        <NameLength />
        <DataTable />
        <Conclusions />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
