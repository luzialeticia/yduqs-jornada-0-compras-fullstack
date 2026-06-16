import { GraduationCap, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center">
        <a href="#" className="flex items-center gap-2 text-brand">
          <GraduationCap className="h-7 w-7" aria-hidden />
          <span className="text-2xl font-extrabold tracking-tight">
            Estácio
          </span>
        </a>
        <a
          href="#"
          className="ml-auto hidden items-center gap-2 text-sm font-medium text-brand sm:flex"
        >
          <Phone className="h-4 w-4" aria-hidden /> 0800 771 5055
        </a>
      </div>
    </header>
  );
}
