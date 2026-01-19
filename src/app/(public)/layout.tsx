
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import NotificationWrapper from '@/components/public/NotificationWrapper';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <NotificationWrapper />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
