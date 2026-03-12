'use client';

interface SocialLinksProps {
  onHoverChange?: (hovering: boolean) => void;
}

export default function SocialLinks({ onHoverChange }: SocialLinksProps) {
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/patwingzzz',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'Strava',
      href: 'https://strava.app.link/gVriWQZiL0b',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"></path>
        </svg>
      )
    },
    {
      name: 'Dare2tri',
      href: 'https://give.dare2tri.org/fundraiser/6928347',
      icon: (
        <svg viewBox="0 0 45 77" fill="currentColor" className="h-5 md:h-6 w-auto opacity-90">
          <path d="M9.237 58.4116H0l16.5349-50.89h9.2314l-16.5292 50.89z" />
          <path d="M34.8944 67.8667h-9.2428l16.5349-50.89h9.2371l-16.5292 50.89z" />
          <path d="M42.5709 0h-9.2371L8.4108 76.7022h9.2429L42.5709 0z" />
        </svg>
      )
    },
    {
      name: 'Linktree',
      href: 'https://linktr.ee/patrickwingert',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
          <path d="M13.435 5.589c-.198-.444-.619-.444-.817 0l-3.376 7.552h-2.93l4.632-6.525c.29-.408.29-1.07 0-1.478l-3.793-5.342h9.529l-3.794 5.342c-.29.408-.29 1.07 0 1.478l4.632 6.525h-2.93l-3.376-7.552z" />
          <path d="M12.026 15.65c-.482 0-.872.417-.872.932v7.418h1.745v-7.418c0-.515-.39-.932-.873-.932z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex justify-center gap-8">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.name}
          className="relative text-white transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110 flex items-center justify-center outline-none"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
