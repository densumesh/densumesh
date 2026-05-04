import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

import { cn } from './utils';
import { Icon } from './icons';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border border-border-sub rounded-2xl overflow-hidden', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="not-prose flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:-outline-offset-4 focus-visible:rounded-2xl flex flex-1 items-start justify-between gap-6 px-5 py-4 text-left text-base/[150%] [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <Icon.ChevronDown className="text-muted pointer-events-none size-3.5 shrink-0 translate-y-1 " />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="text-sm/[150%] tracking-[-0.084px] text-text-sub -mt-1 overflow-hidden"
      {...props}
    >
      <div className={cn('px-5 pb-4 text-text-sub leading-[175%]', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
