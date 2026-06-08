export type BlockType = 'hero' | 'rich_text' | 'image' | 'cta' | 'gallery' | 'embed';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  heading: string;
  subheading?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  align?: 'left' | 'center';
}

export interface RichTextBlock extends BaseBlock {
  type: 'rich_text';
  html: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  image_url: string;
  alt?: string;
  caption?: string;
  width?: 'narrow' | 'wide' | 'full';
}

export interface CtaBlock extends BaseBlock {
  type: 'cta';
  heading: string;
  text?: string;
  button_label: string;
  button_url: string;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: { url: string; alt?: string }[];
  columns?: 2 | 3 | 4;
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  html: string;
}

export type PageBlock = HeroBlock | RichTextBlock | ImageBlock | CtaBlock | GalleryBlock | EmbedBlock;

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: 'Hero',
  rich_text: 'Rich text',
  image: 'Image',
  cta: 'Call to action',
  gallery: 'Image gallery',
  embed: 'Embed / iframe',
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const createBlock = (type: BlockType): PageBlock => {
  switch (type) {
    case 'hero':
      return { id: uid(), type, heading: 'New hero heading', subheading: '', image_url: '', cta_label: '', cta_url: '', align: 'left' };
    case 'rich_text':
      return { id: uid(), type, html: '<p>Write something…</p>' };
    case 'image':
      return { id: uid(), type, image_url: '', alt: '', caption: '', width: 'wide' };
    case 'cta':
      return { id: uid(), type, heading: 'Ready to get involved?', text: '', button_label: 'Learn more', button_url: '/' };
    case 'gallery':
      return { id: uid(), type, images: [], columns: 3 };
    case 'embed':
      return { id: uid(), type, html: '' };
  }
};
