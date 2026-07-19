import { faqItems } from "@/lib/marketplace-data";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal className="mb-10 text-center">
        <p className="text-sm font-medium text-brand-cyan">FAQ</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <Accordion defaultValue={["item-0"]} className="rounded-2xl bg-card ring-1 ring-foreground/10">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`item-${i}`} className="px-5">
              <AccordionTrigger className="text-left font-heading font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
