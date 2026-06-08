import { Button } from '@/components/ui/button';
import type { PageBlock } from '@/lib/pageBlocks';
import { cn } from '@/lib/utils';

interface Props {
  blocks: PageBlock[];
}

const widthClass = {
  narrow: 'max-w-2xl',
  wide:   'max-w-5xl',
  full:   'max-w-none',
} as const;

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const CtaLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) =>
  isExternal(href)
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
    : <a href={href} className={className}>{children}</a>;

export const PageBlockRenderer = ({ blocks }: Props) => {
  return (
    <div className="space-y-12 md:space-y-20">
      {blocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return (
              <section key={block.id} className={cn('container mx-auto px-4 py-12 md:py-20',
                block.align === 'center' ? 'text-center' : 'text-left')}>
                <div className={cn('grid gap-8 items-center', block.image_url ? 'md:grid-cols-2' : 'grid-cols-1')}>
                  <div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{block.heading}</h1>
                    {block.subheading && (
                      <p className="mt-4 text-lg md:text-xl text-muted-foreground">{block.subheading}</p>
                    )}
                    {block.cta_label && block.cta_url && (
                      <div className={cn('mt-6', block.align === 'center' && 'flex justify-center')}>
                        <Button asChild size="lg">
                          <CtaLink href={block.cta_url}>{block.cta_label}</CtaLink>
                        </Button>
                      </div>
                    )}
                  </div>
                  {block.image_url && (
                    <img src={block.image_url} alt={block.heading}
                      className="w-full h-auto rounded-2xl object-cover" loading="lazy" />
                  )}
                </div>
              </section>
            );

          case 'rich_text':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert prose-headings:font-bold"
                  dangerouslySetInnerHTML={{ __html: block.html }} />
              </section>
            );

          case 'image':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <figure className={cn('mx-auto', widthClass[block.width ?? 'wide'])}>
                  {block.image_url && (
                    <img src={block.image_url} alt={block.alt ?? ''}
                      className="w-full h-auto rounded-xl" loading="lazy" />
                  )}
                  {block.caption && (
                    <figcaption className="mt-2 text-sm text-muted-foreground text-center">{block.caption}</figcaption>
                  )}
                </figure>
              </section>
            );

          case 'cta':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center">
                  <h2 className="text-2xl md:text-4xl font-bold">{block.heading}</h2>
                  {block.text && <p className="mt-3 text-base md:text-lg opacity-90 max-w-2xl mx-auto">{block.text}</p>}
                  <div className="mt-6">
                    <Button asChild size="lg" variant="secondary">
                      <CtaLink href={block.button_url}>{block.button_label}</CtaLink>
                    </Button>
                  </div>
                </div>
              </section>
            );

          case 'gallery': {
            const cols = block.columns ?? 3;
            const gridClass = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-3';
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className={cn('grid grid-cols-1 gap-4', gridClass)}>
                  {block.images.map((img, i) => (
                    <img key={i} src={img.url} alt={img.alt ?? ''}
                      className="w-full h-64 object-cover rounded-xl" loading="lazy" />
                  ))}
                </div>
              </section>
            );
          }

          case 'embed':
            return (
              <section key={block.id} className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: block.html }} />
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default PageBlockRenderer;
