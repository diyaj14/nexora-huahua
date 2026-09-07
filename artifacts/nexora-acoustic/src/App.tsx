import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUpRight, Check, ChevronRight, Menu, Moon, Paperclip, Sun, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { KineticText } from '@/components/ui/kinetic-text';
import { ArrowFillButton } from '@/components/ui/arrow-fill-button';
import { AnimatedTestimonials } from '@/components/ui/testimonial';
import { CircularRevealHeading } from '@/components/ui/circular-reveal-heading';
import CircularSplitRoll from '@/components/ui/circular-split-roll';
import { NexoraSharedTabs } from '@/components/ui/nexora-shared-tabs';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import heroAuditorium from './assets/nexora-acoustic-hero.jpg';

const queryClient = new QueryClient();
const auditorium = heroAuditorium;

const services = [
  {
    id: 1,
    number: '01',
    title: 'Architectural Acoustics',
    sub: 'Designing spaces that sound right',
    subtitle: 'Designing spaces that sound right',
    body: 'Statutory compliance, speech privacy thresholds, and partition sound insulation across commercial, civic, and residential spaces.',
    description: 'Statutory compliance, speech privacy thresholds, and partition sound insulation across commercial, civic, and residential spaces.',
    tags: 'Room Acoustics  •  Sound Insulation  •  Reverberation Control  •  Speech Privacy',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    badge: 'Building Design',
  },
  {
    id: 2,
    number: '02',
    title: 'Mechanical Acoustics',
    sub: 'Controlling building services noise',
    subtitle: 'Controlling building services noise',
    body: 'Targeted noise and vibration attenuation for HVAC chillers, plant rooms, ductwork paths, and MEP riser penetrations.',
    description: 'Targeted noise and vibration attenuation for HVAC chillers, plant rooms, ductwork paths, and MEP riser penetrations.',
    tags: 'HVAC Attenuation  •  Plant Rooms  •  Duct-Borne Noise  •  Vibration Isolation',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    badge: 'MEP Engineering',
  },
  {
    id: 3,
    number: '03',
    title: 'Noise & Vibration Control',
    sub: 'Identify. Assess. Predict. Control.',
    subtitle: 'Identify. Assess. Predict. Control.',
    body: 'Environmental noise surveys, 3D ray-tracing sound propagation models, and structural vibration isolation strategies.',
    description: 'Environmental noise surveys, 3D ray-tracing sound propagation models, and structural vibration isolation strategies.',
    tags: 'Noise Assessment  •  3D Ray Tracing  •  Prediction  •  Mitigation',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    badge: 'Environmental & Site',
  },
  {
    id: 4,
    number: '04',
    title: 'Acoustic Testing',
    sub: 'Measure performance. Verify results.',
    subtitle: 'Measure performance. Verify results.',
    body: 'On-site precision commissioning testing for sound insulation (DnTw / ASTC), room reverberation (RT60), and noise criteria (NC / NR).',
    description: 'On-site precision commissioning testing for sound insulation (DnTw / ASTC), room reverberation (RT60), and noise criteria (NC / NR).',
    tags: 'Sound Insulation (DnTw)  •  RT60 Testing  •  NC/NR Verification  •  Certification',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    badge: 'Commissioning',
  },
  {
    id: 5,
    number: '05',
    title: 'Specialist Venues',
    sub: 'High-clarity acoustic environments',
    subtitle: 'High-clarity acoustic environments',
    body: 'Tuned timber acoustic baffles, flutter echo mitigation, and studio-grade sound isolation for auditoriums, studios, and cinemas.',
    description: 'Tuned timber acoustic baffles, flutter echo mitigation, and studio-grade sound isolation for auditoriums, studios, and cinemas.',
    tags: 'Auditoriums  •  Recording Studios  •  Cinemas  •  Performance Halls',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    badge: 'Acoustic Architecture',
  },
];

const sectors = [
  {
    name: 'Residential & Mixed-Use',
    title: 'Residential & Mixed-Use',
    quote: 'Statutory acoustic compliance, internal speech privacy thresholds, and sound insulation detailing for multi-residential towers, apartments, residential estates, and mixed-use developments to ensure peaceful living spaces.',
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Hotels & Hospitality',
    title: 'Hotels & Hospitality',
    quote: 'High-performance inter-room partition isolation, mechanical plant vibration control, and quiet air distribution ensuring five-star acoustic comfort for luxury guestrooms, dining venues, and conference facilities.',
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Commercial & Workspaces',
    title: 'Commercial & Workspaces',
    quote: 'Speech privacy engineering, room reverberation tuning, and facade noise control for corporate headquarters, open-plan workspaces, confidential meeting rooms, and modern tenant fit-outs.',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Entertainment & Public Buildings',
    title: 'Entertainment & Public Buildings',
    quote: 'Room acoustic shaping, tailored acoustic absorption, and building envelope sound isolation designed specifically for auditoriums, cinemas, theatres, public libraries, and civic assembly spaces.',
    src: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Infrastructure & Specialised Facilities',
    title: 'Infrastructure & Specialised Facilities',
    quote: 'Industrial noise mitigation, heavy MEP structural vibration isolation, and precision acoustic testing for hospital wards, data centres, transport interchanges, and testing laboratories.',
    src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  },
];

const whyNexoraItems = [
  {
    number: '01',
    title: 'Specialised acoustic engineering expertise',
    body: 'Focused technical knowledge across architectural and mechanical acoustics.',
  },
  {
    number: '02',
    title: 'Architectural & Mechanical solutions',
    body: 'One acoustic partner for both building design and MEP noise challenges.',
  },
  {
    number: '03',
    title: 'Practical & cost-effective strategies',
    body: 'Solutions selected to balance acoustic performance, constructability, and project cost.',
  },
  {
    number: '04',
    title: 'Detailed technical analysis',
    body: 'Acoustic calculations, assessments, reports, and design recommendations.',
  },
  {
    number: '05',
    title: 'International acoustic standards',
    body: 'Solutions developed with applicable project criteria and recognized standards in mind.',
  },
  {
    number: '06',
    title: 'Project-focused collaboration',
    body: 'Close coordination with architects, engineers, contractors, developers, and owners.',
  },
];

const processItems = [
  {
    text: 'UNDERSTAND',
    title: 'Understand',
    number: '01',
    summary: 'Set goals and constraints.',
    description: 'Statutory acoustic criteria, architectural intentions, privacy thresholds, and noise baselines.',
    deliverables: 'Acoustic brief · Benchmark targets',
  },
  {
    text: 'ANALYSE',
    title: 'Analyse',
    number: '02',
    summary: 'Study sources and paths.',
    description: '3D ray tracing, computational reverberation (RT60), transmission loss, and HVAC paths.',
    deliverables: '3D ray models · RT60 simulations',
  },
  {
    text: 'ENGINEER',
    title: 'Engineer',
    number: '03',
    summary: 'Build the right strategy.',
    description: 'Bespoke partition buildups, floating floors, timber absorption baffles, and attenuators.',
    deliverables: 'Partition schedules · Material specs',
  },
  {
    text: 'COORDINATE',
    title: 'Coordinate',
    number: '04',
    summary: 'Integrate with the design.',
    description: 'Cross-disciplinary detailing with architects, MEP consultants, and contractors.',
    deliverables: 'BIM integration · Flanking detailing',
  },
  {
    text: 'VERIFY',
    title: 'Verify',
    number: '05',
    summary: 'Measure the result.',
    description: 'On-site precision commissioning for sound insulation (DnTw) and background noise (NC/NR).',
    deliverables: 'Insulation testing · RT60 verification',
  },
];

function Reveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const [visible, setVisible] = useState(false);
  return <div className={`reveal ${visible ? 'visible' : ''} ${delay} ${className}`} ref={(element) => {
    if (!element || visible) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: .08 });
    observer.observe(element);
  }}>{children}</div>;
}

function Logo({ inverted = false }: { inverted?: boolean }) {
  return <a href="#home" className={`flex items-center gap-3 ${inverted ? 'text-white' : 'text-[hsl(var(--foreground))]'}`} data-testid="link-logo">
    <span className="relative flex h-8 w-8 items-center justify-center border border-current"><span className="absolute h-4 w-px bg-current" /><span className="absolute h-px w-4 bg-current" /></span>
    <span className="leading-none"><span className="block text-[1.35rem] tracking-[-.04em] font-bold" style={{ fontFamily: 'var(--app-font-heading)' }}>Nexora</span><span className="mono block text-[.48rem] tracking-[.28em] opacity-70">Acoustic</span></span>
  </a>;
}

function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    const observers = ['home', 'about', 'services', 'sectors', 'process', 'why-nexora', 'contact'].map((id) => {
      const node = document.getElementById(id);
      if (!node) return null;
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(id); }, { rootMargin: '-25% 0px -60% 0px' });
      observer.observe(node); return observer;
    });
    return () => { window.removeEventListener('scroll', onScroll); observers.forEach((observer) => observer?.disconnect()); };
  }, []);
  const links = [['home', 'Home'], ['about', 'About'], ['services', 'Services'], ['sectors', 'Sectors'], ['process', 'Process'], ['why-nexora', 'Why Nexora'], ['contact', 'Contact']];
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[hsl(var(--background)/96%)] backdrop-blur-lg border-b border-[hsl(var(--border))] shadow-xs' : 'bg-[hsl(var(--background)/90%)] backdrop-blur-md border-b border-[hsl(var(--border)/70%)] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'}`}>
        <div className="container-nx flex h-[68px] sm:h-[72px] lg:h-[76px] items-center justify-between">
          <Logo />
          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 lg:gap-8 xl:gap-9 lg:flex" aria-label="Primary navigation">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={`nav-link mono text-[.64rem] ${active === id ? 'active' : ''}`} data-testid={`link-nav-${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] transition-all duration-200 hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] cursor-pointer select-none"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              data-testid="button-theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-[hsl(var(--accent))] transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon size={17} className="transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* "Start an enquiry" button shown on sm tablet and desktop */}
            <ArrowFillButton
              href="#contact"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
              data-testid="link-nav-enquiry"
              btnText="Start an enquiry"
            />
            {/* Mobile menu toggle (three slash / hamburger button) */}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="border border-[hsl(var(--foreground)/.25)] p-2 lg:hidden cursor-pointer hover:bg-[hsl(var(--card))] transition-colors rounded-sm"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              data-testid="button-mobile-menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (Opened via the hamburger button) */}
      {open && (
        <div className="fixed inset-x-0 top-[68px] sm:top-[72px] lg:hidden bottom-0 z-50 overflow-y-auto bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] shadow-2xl">
          <nav className="container-nx py-6 sm:py-8 flex flex-col justify-between min-h-[calc(100dvh-68px)] sm:min-h-[calc(100dvh-72px)]" aria-label="Mobile navigation menu">
            <div className="flex flex-col divide-y divide-[hsl(var(--border)/60%)]">
              {links.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`mono flex items-center justify-between py-4 text-sm tracking-wider uppercase transition-colors ${
                    active === id ? 'text-[hsl(var(--accent))] font-bold' : 'text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]'
                  }`}
                  data-testid={`link-mobile-${id}`}
                >
                  <span>{label}</span>
                  <span className="text-xs opacity-40">→</span>
                </a>
              ))}
            </div>
            <div className="pt-6 pb-12 mt-6 border-t border-[hsl(var(--border))] shrink-0 space-y-4">
              {/* Mobile Theme Toggle Row */}
              <div className="flex items-center justify-between py-2 px-1">
                <span className="mono text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  Appearance
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-xs mono text-[hsl(var(--foreground))] cursor-pointer hover:border-[hsl(var(--accent))] transition-colors"
                  aria-label="Toggle theme appearance"
                  data-testid="button-mobile-theme-toggle"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={14} className="text-[hsl(var(--accent))]" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon size={14} className="text-[hsl(var(--accent))]" />
                      <span>Light Theme</span>
                    </>
                  )}
                </button>
              </div>

              <ArrowFillButton
                href="#contact"
                onClick={() => setOpen(false)}
                variant="primary"
                size="default"
                className="w-full justify-center"
                data-testid="link-mobile-enquiry"
                btnText="Start an enquiry"
              />
              <p className="mt-4 text-center mono text-[0.62rem] text-[hsl(var(--muted-foreground))]">
                Nexora Acoustic Engineering Services
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

function Hero() {
  return <section id="home" className="relative min-h-[calc(100vh-68px)] lg:min-h-[820px] overflow-hidden bg-[hsl(var(--background))] pt-[68px] sm:pt-[72px] lg:pt-[76px] flex flex-col justify-center">
    <div className="container-nx relative z-10 w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 xl:col-span-6 pr-0 lg:pr-8">
          <Reveal delay="reveal-delay-1"><KineticText as="h1" className="display text-[clamp(1.85rem,3.2vw,3.15rem)] leading-[1.08] tracking-[-0.02em] [font-optical-sizing:auto]" data-testid="heading-hero">Creating better<br />spaces through<br />acoustic<br />excellence.</KineticText></Reveal>
          <Reveal delay="reveal-delay-2"><p className="mt-7 sm:mt-9 max-w-[500px] text-[1.02rem] sm:text-[1.08rem] leading-relaxed text-[hsl(var(--muted-foreground))]">Engineering-driven acoustic solutions for quieter, better-performing spaces.</p></Reveal>
          <Reveal delay="reveal-delay-3"><div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"><ArrowFillButton href="#contact" variant="primary" size="default" data-testid="link-hero-contact" btnText="Discuss your project" /></div></Reveal>
          <div className="mt-12 hidden items-center gap-3 lg:flex"><span className="mono text-[.6rem] text-[hsl(var(--muted-foreground))]">Scroll to explore</span><span className="h-px w-14 bg-[hsl(var(--border))]" /></div>

          {/* Mobile responsive image display */}
          <div className="mt-10 relative w-full h-[280px] sm:h-[380px] overflow-hidden border border-[hsl(var(--border))] lg:hidden">
            <img src={auditorium} alt="State-of-the-art acoustic auditorium with sculptural sound diffusion architecture, deep navy panels, and cyan illumination" className="h-full w-full object-cover object-center" referrerPolicy="no-referrer" data-testid="img-hero-auditorium-mobile" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-[hsl(var(--background)/92%)] backdrop-blur-sm px-3 py-1.5 border border-[hsl(var(--border))]">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
              <span className="mono text-[.55rem]">Sound, shaped by space</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Desktop right-aligned image sticking flush to the right viewport edge */}
    <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[47vw] xl:w-[49vw] h-full z-0 overflow-hidden border-l border-[hsl(var(--border))]">
      <img src={auditorium} alt="State-of-the-art acoustic auditorium with sculptural sound diffusion architecture, deep navy panels, and cyan illumination" className="hero-image h-full w-full object-cover object-center" referrerPolicy="no-referrer" data-testid="img-hero-auditorium" />
      <div className="absolute bottom-8 right-8 flex items-center gap-3 bg-[hsl(var(--background)/92%)] backdrop-blur-md px-4 py-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm">
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
        <span className="mono text-[.58rem]">Sound, shaped by space</span>
      </div>
    </div>
  </section>;
}

function Intro() {
  return (
    <section id="about" className="border-y border-[hsl(var(--border))] py-16 md:py-24 bg-[hsl(var(--background))]">
      <div className="container-nx">
        <Reveal>
          <NexoraSharedTabs />
        </Reveal>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-12 md:py-16 overflow-hidden">
      {/* Circular Split Roll: One side heading, the other side a box with details */}
      <div className="w-full">
        <CircularSplitRoll
          items={services}
          radius={380}
          cardWidth={370}
          cardHeight={270}
          sectionHeight={70}
          titleSize="clamp(1.85rem, 3.2vw, 3.15rem)"
          columnSpreadVw={3.5}
          columnOffsetPx={420}
          className="w-full"
        />
      </div>
    </section>
  );
}

function Sectors() {
  return <section id="sectors" className="py-20 md:py-28">
    <div className="container-nx">
      <div>
        <AnimatedTestimonials
          testimonials={sectors}
          autoplay={false}
          themeAware={true}
          className="w-full px-0 py-6 font-sans antialiased"
        />
      </div>
    </div>
  </section>;
}

function Process() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="process" className="relative border-b border-[hsl(var(--border))] bg-[hsl(var(--background))] py-20 md:py-28 lg:py-32 overflow-hidden">
      <div className="container-nx">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-14">
          {/* Left Column: Heading, Description & Stage Selectors */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <Reveal>
              <h2 className="display text-[clamp(1.85rem,3.2vw,3.15rem)] leading-[1.08] tracking-[-0.02em]">
                Our methodology.
              </h2>
              <p className="mt-6 text-[1.02rem] sm:text-[1.08rem] leading-7 text-[hsl(var(--muted-foreground))] max-w-[480px]">
                From initial acoustic benchmarking to final on-site verification, explore each phase of our structured process around the circular dial.
              </p>
            </Reveal>

            {/* Quick Stage Selector Bar for Touch and Desktop Navigation */}
            <Reveal delay="reveal-delay-2" className="mt-8 sm:mt-10">
              <div className="flex flex-wrap items-center gap-2">
                {processItems.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={step.number}
                      type="button"
                      onMouseEnter={() => setActiveStep(idx)}
                      onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                      className={cn(
                        "mono px-3 py-1.5 text-[0.68rem] sm:text-xs transition-all duration-200 border cursor-pointer",
                        isActive
                          ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-bold shadow-sm"
                          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground)/0.4)] hover:text-[hsl(var(--foreground))]"
                      )}
                      aria-label={`Select stage ${step.number} ${step.title}`}
                    >
                      <span className="opacity-75 mr-1.5">{step.number}</span>
                      <span>{step.title}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mono mt-5 text-[0.62rem] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                {activeStep !== null
                  ? `Active: Stage ${processItems[activeStep].number} — ${processItems[activeStep].title}`
                  : "Interactive Dial · Hover or click a stage"}
              </p>
            </Reveal>
          </div>

          {/* Right Column: Circular Methodology Dial */}
          <div className="lg:col-span-7 flex items-center justify-center lg:justify-end">
            <Reveal delay="reveal-delay-2" className="w-full flex items-center justify-center lg:justify-end">
              <div className="relative flex items-center justify-center p-2 sm:p-4">
                <CircularRevealHeading
                  items={processItems}
                  activeItem={activeStep}
                  onActiveChange={setActiveStep}
                  size="xl"
                  mode="text"
                  variant="theme"
                  centerText={
                    <div className="flex flex-col items-center justify-center p-2 select-none">
                      <span className="mono text-[0.55rem] sm:text-[0.62rem] tracking-[0.24em] uppercase text-[hsl(var(--accent))] mb-1 font-semibold">
                        Methodology
                      </span>
                      <span className="display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                        Our Process
                      </span>
                      <p className="mt-2 text-[0.66rem] sm:text-[0.74rem] text-[hsl(var(--muted-foreground))] max-w-[240px] leading-relaxed">
                        Hover each stage along the circumference to inspect details.
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 mono text-[0.52rem] sm:text-[0.58rem] text-[hsl(var(--accent))] uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                        5 Interactive Stages
                      </div>
                    </div>
                  }
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNexora() {
  return (
    <section id="why-nexora" className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] py-20 md:py-28">
      <div className="container-nx">
        <Reveal>
          <div>
            <span className="mono text-[.64rem] tracking-[.2em] uppercase text-[hsl(var(--accent))]">
              Why Nexora
            </span>
            <h2 className="display mt-3 max-w-[680px] text-[clamp(1.85rem,3.2vw,3.15rem)] leading-[1.08] tracking-[-0.02em]">
              Built around<br />performance, practicality,<br />and precision.
            </h2>
            <p className="mt-5 max-w-[550px] text-[1.05rem] leading-7 text-[hsl(var(--muted-foreground))]">
              Practical acoustic solutions for real project requirements.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {whyNexoraItems.map((item, index) => (
            <Reveal key={item.number} delay={`reveal-delay-${(index % 3) + 1}`}>
              <article
                className="group relative flex h-full flex-col justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/80%)] p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[hsl(var(--accent)/60%)] hover:bg-[hsl(var(--card))] hover:shadow-md cursor-default"
                data-testid={`why-nexora-card-${item.number}`}
              >
                {/* Subtle top indicator on hover */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-[hsl(var(--accent))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="mono text-xs font-semibold tracking-wider text-[hsl(var(--accent))]">
                      {item.number}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--border))] transition-colors duration-300 group-hover:bg-[hsl(var(--accent))]" />
                  </div>

                  <h3 className="display text-xl sm:text-[1.32rem] leading-[1.25] text-[hsl(var(--foreground))] transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[0.92rem] sm:text-[0.98rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { setError('Please complete the required fields before submitting.'); form.reportValidity(); return; }
    setError(''); setSubmitted(true); form.reset();
  };
  return <section id="contact" className="bg-[hsl(var(--primary))] py-20 text-[hsl(var(--primary-foreground))] md:py-28">
     <div className="container-nx"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><div><Reveal><h2 className="display text-[clamp(1.85rem,3.2vw,3.15rem)] leading-[1.08] tracking-[-0.02em]">Let's create<br />better acoustic<br />environments.</h2><p className="mt-9 max-w-[440px] leading-7 text-[hsl(var(--primary-foreground)/.68)]">Design, assessment, noise control, or testing—we can help.</p><div className="mt-12 border-t border-[hsl(var(--primary-foreground)/.18)] pt-6"><p className="mono text-[.62rem] text-[hsl(var(--accent))]">What can we help with?</p><p className="mt-4 max-w-[400px] text-[.9rem] leading-7 text-[hsl(var(--primary-foreground)/.66)]">Design  ·  HVAC  ·  Noise  ·  Vibration  ·  Testing  ·  Sound insulation</p></div></Reveal></div>
        <Reveal delay="reveal-delay-1"><div className="bg-[hsl(var(--background))] p-6 text-[hsl(var(--foreground))] md:p-10"><div className="mb-8 flex items-end justify-between"><div><h3 className="display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.12]">Tell us about<br />your project.</h3></div><span className="mono hidden text-[.6rem] text-[hsl(var(--muted-foreground))] sm:block">NXS / 01</span></div>{submitted ? <div className="flex min-h-[390px] flex-col items-center justify-center text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Check size={25} /></span><h3 className="display mt-7 text-4xl">Thank you.</h3><p className="mt-4 max-w-[340px] leading-7 text-[hsl(var(--muted-foreground))]">Your enquiry has been received.</p><ArrowFillButton type="button" onClick={() => setSubmitted(false)} variant="quiet" size="default" className="mt-8" data-testid="button-new-enquiry" btnText="Send another enquiry" /></div> : <form onSubmit={handleSubmit}><div className="grid gap-7 sm:grid-cols-2"><label><span className="form-label">Name <b aria-hidden="true">*</b></span><input className="input-nx" name="name" required placeholder="Your name" data-testid="input-name" /></label><label><span className="form-label">Company <b aria-hidden="true">*</b></span><input className="input-nx" name="company" required placeholder="Company name" data-testid="input-company" /></label><label><span className="form-label">Email <b aria-hidden="true">*</b></span><input className="input-nx" type="email" name="email" required placeholder="you@company.com" data-testid="input-email" /></label><label><span className="form-label">Phone</span><input className="input-nx" type="tel" name="phone" placeholder="+00 000 000 000" data-testid="input-phone" /></label><label><span className="form-label">Project type <b aria-hidden="true">*</b></span><select className="input-nx" name="projectType" required defaultValue="" data-testid="select-project-type"><option value="" disabled>Select a project type</option><option>Residential & Mixed-Use</option><option>Hotels & Hospitality</option><option>Commercial</option><option>Entertainment & Public Buildings</option><option>Infrastructure & Specialised Facilities</option></select></label><label><span className="form-label">Location <b aria-hidden="true">*</b></span><input className="input-nx" name="location" required placeholder="City, country" data-testid="input-location" /></label></div><label className="mt-8 block"><span className="form-label">Acoustic requirements <b aria-hidden="true">*</b></span><textarea className="input-nx" name="requirements" required placeholder="Tell us about your project" data-testid="textarea-requirements" /></label><label className="mt-7 flex cursor-pointer items-center gap-3 text-[.8rem] text-[hsl(var(--muted-foreground))]"><Paperclip size={15} /><span>Attach project information</span><input type="file" name="attachment" className="sr-only" data-testid="input-attachment" /><span className="mono border border-[hsl(var(--border))] px-2 py-1 text-[.56rem]">Choose file</span></label>{error && <p role="alert" className="form-error mt-5">{error}</p>}<ArrowFillButton type="submit" variant="primary" size="default" className="mt-9 w-full justify-center" data-testid="button-submit-enquiry" btnText="Submit enquiry" /><p className="mt-4 text-[.7rem] text-[hsl(var(--muted-foreground))]">Your project details stay with Nexora.</p></form>}</div></Reveal></div>
        <div className="mt-24 grid gap-8 border-t border-[hsl(var(--primary-foreground)/.18)] pt-8 md:grid-cols-3"><div><p className="mono text-[.6rem] text-[hsl(var(--accent))]">Prefer to contact us directly?</p></div><div><p className="display text-2xl">Nexora Acoustic<br />Engineering Services</p></div><div className="text-[.85rem] leading-7 text-[hsl(var(--primary-foreground)/.6)]"><p>Phone: [To be confirmed]</p><p>Email: [To be confirmed]</p><p>Website: [To be confirmed]</p></div></div>
      </div>
    </section>;
  }

function Footer() {
  return <footer className="bg-[hsl(var(--primary))] pb-8 text-[hsl(var(--primary-foreground))]"><div className="container-nx"><div className="line-rule opacity-20" /><div className="flex flex-col justify-between gap-6 pt-8 text-[.72rem] text-[hsl(var(--primary-foreground)/.5)] md:flex-row"><Logo inverted /><p>Acoustic engineering for better-performing spaces.</p><a href="#home" className="footer-link inline-flex items-center gap-2" data-testid="link-back-top">Back to top <ArrowDown size={14} className="rotate-180" /></a></div></div></footer>;
}

function Home() {
  return <div className="grain nexora-page min-h-[100dvh]"><Nav /><main><Hero /><Intro /><Services /><Sectors /><Process /><WhyNexora /><Contact /></main><Footer /></div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;