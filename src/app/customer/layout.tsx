import Navbar from './components/navbar';
import FooterSection from './components/footer';
import ChatBot from './components/ChatBot';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <FooterSection />
      <ChatBot />
    </div>
  );
}
