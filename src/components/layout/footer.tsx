import Link from 'next/link';
import { Waves } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <Waves className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Welcomely</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Welcomely. All Rights Reserved.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
