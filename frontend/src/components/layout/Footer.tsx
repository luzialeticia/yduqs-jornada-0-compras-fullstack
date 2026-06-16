import { ChevronDown, GraduationCap, Phone, QrCode } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

const sections: { title: string; links: string[] }[] = [
  {
    title: 'A Estácio',
    links: [
      'Sobre a Estácio',
      'Unidades',
      'Sustentabilidade',
      'Regulamentos',
      'Instituições de Ensino',
      'Trabalhe na Estácio',
      'Convênios com Empresas',
      'Seja Parceiro',
      'Seja Fornecedor',
      'Imprensa',
    ],
  },
  {
    title: 'Estude na Estácio',
    links: [
      'Por que nossa graduação?',
      'Por que nossa pós?',
      'Bolsas e financiamento',
      'Carreiras',
      'Modelos de Ensino',
      'Formas de ingresso',
      'Internacionalização',
      'Clube do aluno',
      'Informações e-MEC',
    ],
  },
  {
    title: 'Cursos',
    links: ['Graduação', 'Pós-graduação', 'Cursos Livres'],
  },
  {
    title: 'Inscreva-se',
    links: [
      'Vestibular',
      'Enem',
      'Transferência',
      '2ª Graduação',
      'Pós-Graduação',
      'Mestrado e Doutorado',
      'Cursos livres',
    ],
  },
  {
    title: 'Área do aluno',
    links: [
      'Acessar área do aluno',
      'Aplicativo na App Store',
      'Aplicativo na Google Play',
    ],
  },
  {
    title: 'Para começar',
    links: [
      'Dicas de Estudo',
      'Ensino Digital',
      'Mercado de Trabalho',
      'Sou calouro',
      'Por que Estácio?',
    ],
  },
  {
    title: 'Redes sociais',
    links: ['Instagram', 'Facebook', 'LinkedIn', 'Youtube'],
  },
  {
    title: 'Fale com a gente',
    links: ['Atendimento', 'Ouvidoria'],
  },
];

const legalLinks = [
  'Política de privacidade',
  'Código de Ética',
  'Preferências de cookies',
  'Mapa do site',
];

export function Footer() {
  return (
    <footer className="mt-12 bg-brand text-primary-foreground">
      <div className="container py-8">
        {/* Logo + contato */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7" aria-hidden />
            <span className="text-2xl font-extrabold">Estácio</span>
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <a href="#" className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]">
                <WhatsAppIcon className="h-4 w-4 text-white" />
              </span>
              Precisa de ajuda?
            </a>
            <a href="#" className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              0800 771 5055
            </a>
          </div>
        </div>

        {/* Menu institucional: acordeão no mobile, colunas no desktop */}
        <nav className="md:grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-4">
          {sections.map((section) => (
            <FooterSection key={section.title} {...section} />
          ))}
        </nav>

        {/* Selo e-MEC */}
        <div className="mt-8 flex max-w-sm items-center gap-3 rounded-md bg-white/10 p-4 text-xs">
          <QrCode className="h-14 w-14 shrink-0" aria-hidden />
          <div>
            <p>Consulte aqui o cadastro da Instituição no Sistema e-MEC.</p>
            <span className="mt-1 inline-block font-bold uppercase tracking-wide text-brand-bright">
              Acesse já!
            </span>
          </div>
        </div>
      </div>

      {/* Rodapé legal */}
      <div className="border-t border-white/10 bg-brand-dark">
        <div className="container flex flex-col gap-2 py-5 text-xs text-white/70">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="hover:text-white">
                {link}
              </a>
            ))}
          </div>
          <span>Estácio Brasil — Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }: { title: string; links: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-1 md:border-0 md:py-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-xs font-bold uppercase tracking-wide md:cursor-default md:py-0 md:pb-3"
      >
        {title}
        <ChevronDown
          aria-hidden
          className={cn(
            'h-4 w-4 transition-transform md:hidden',
            open && 'rotate-180',
          )}
        />
      </button>
      <ul
        className={cn(
          'flex-col gap-2 pb-3 text-sm text-white/70 md:flex md:pb-0',
          open ? 'flex' : 'hidden',
        )}
      >
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
