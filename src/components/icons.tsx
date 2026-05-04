import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

function ChevronDown({ className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export const Icon = { ChevronDown };
