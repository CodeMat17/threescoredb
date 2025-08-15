export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 64 64'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <circle cx='32' cy='32' r='30' stroke='currentColor' strokeWidth='4' />
      <path
        d='M20 34 L32 18 L44 34'
        stroke='currentColor'
        strokeWidth='4'
        fill='none'
      />
      <rect
        x='24'
        y='34'
        width='16'
        height='12'
        stroke='currentColor'
        strokeWidth='4'
        fill='none'
      />
    </svg>
  );
}

