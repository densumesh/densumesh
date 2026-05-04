import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

interface Props {
  label: string;
  value: string;
  html: string;
}

export default function CollapsibleCode({ label, value, html }: Props) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={value}>
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent>
          <div
            className="collapsible-code text-sm overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
