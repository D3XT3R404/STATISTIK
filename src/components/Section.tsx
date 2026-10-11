import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  tone?: 'default' | 'muted';
}

export default function Section({ id, eyebrow, title, lead, children, tone = 'default' }: SectionProps) {
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={`${id}-judul`}>
      <div className="container">
        <header className="section__head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-judul`}>{title}</h2>
          {lead && <p className="section__lead">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
