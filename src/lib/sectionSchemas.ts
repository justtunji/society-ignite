// Registry of editable sections per public page.
// Adding a new editable field is a one-line change here — the admin UI
// and `useSectionContent` hook pick it up automatically.

export type FieldType = 'text' | 'textarea' | 'rich_text' | 'image' | 'url' | 'boolean' | 'gallery_item' | 'gallery_items';

export interface SectionField {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
}

export interface SectionSchema {
  key: string;             // section_key in DB
  label: string;           // shown in admin
  description?: string;    // shown in admin
  fields: SectionField[];
  defaults: Record<string, any>;
  managedElsewhere?: string; // if set, admin shows a notice instead of an editor
}

export interface PageSchema {
  key: string;             // page_key in DB
  label: string;
  sections: SectionSchema[];
}

// ---------- shared field helpers ----------
const heroFields = (): SectionField[] => [
  { key: 'eyebrow',     label: 'Eyebrow',     type: 'text' },
  { key: 'headline',    label: 'Headline',    type: 'text' },
  { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
  { key: 'image_url',   label: 'Background image', type: 'image' },
  { key: 'cta_label',   label: 'CTA label',   type: 'text' },
  { key: 'cta_url',     label: 'CTA URL',     type: 'url' },
];

// ---------- schemas ----------
export const PAGE_SCHEMAS: PageSchema[] = [
  {
    key: 'home',
    label: 'Home',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        managedElsewhere: 'Edit headline, subheadline and CTA from Site Settings → Hero.',
        fields: [],
        defaults: {},
      },
      {
        key: 'about_intro',
        label: 'About intro',
        description: 'Two paragraphs + “Learn more” button on the homepage About strip.',
        fields: [
          { key: 'paragraph_1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'paragraph_2', label: 'Paragraph 2', type: 'textarea' },
          { key: 'cta_label',   label: 'Button label', type: 'text' },
          { key: 'cta_url',     label: 'Button URL',   type: 'url' },
          { key: 'image_url',   label: 'Side image',   type: 'image' },
        ],
        defaults: {
          paragraph_1: 'The Society of Black Academics (SBA) is an organisation committed to the empowerment of Black academics through the provision of access to opportunities for career advancement, research excellence, and leadership development.',
          paragraph_2: 'We bring together scholars, researchers, educators, and aspiring academics to address challenges, share insights, and support the development of Black communities in higher education.',
          cta_label: 'Learn more',
          cta_url: '/about',
          image_url: '',
        },
      },
      {
        key: 'communities_intro',
        label: 'Communities intro',
        description: 'Copy + side image on the homepage Communities section. Individual communities are managed under Communities.',
        fields: [
          { key: 'eyebrow',    label: 'Eyebrow',    type: 'text' },
          { key: 'paragraph',  label: 'Paragraph',  type: 'textarea' },
          { key: 'image_url',  label: 'Side image', type: 'image' },
        ],
        defaults: {
          eyebrow: 'Our communities',
          paragraph: 'We understand the need for nuance and specificity, which is why we have created several communities that you can join. Each with its unique landscape, language, and content, we hope that you find one that works for you.',
          image_url: '',
        },
      },
      {
        key: 'conference',
        label: 'Upcoming Event (Conference)',
        description: 'The “SBA 2026 Annual Conference” block on the homepage.',
        fields: [
          { key: 'eyebrow',      label: 'Eyebrow',          type: 'text' },
          { key: 'headline',     label: 'Headline',         type: 'text' },
          { key: 'body',         label: 'Body',             type: 'textarea' },
          { key: 'date_text',    label: 'Date line',        type: 'text' },
          { key: 'location_text',label: 'Location line',    type: 'text' },
          { key: 'badge_label',  label: 'Badge label',      type: 'text' },
          { key: 'badge_value',  label: 'Badge value',      type: 'text' },
          { key: 'image_url',    label: 'Flyer image',      type: 'image' },
          { key: 'primary_cta_label', label: 'Primary CTA label', type: 'text' },
          { key: 'primary_cta_url',   label: 'Primary CTA URL',   type: 'url' },
          { key: 'secondary_cta_label', label: 'Secondary CTA label', type: 'text' },
          { key: 'secondary_cta_url',   label: 'Secondary CTA URL',   type: 'url' },
        ],
        defaults: {
          eyebrow: 'Upcoming Event',
          headline: 'SBA 2026 Annual Conference',
          body: 'Join scholars, leaders, and practitioners from across the UK and beyond for our flagship annual conference. A space to connect, collaborate, and shape the future of inclusive higher education.',
          date_text: '2026 — dates to be announced',
          location_text: 'United Kingdom',
          badge_label: 'Save the date',
          badge_value: '2026',
          image_url: '',
          primary_cta_label: 'Support Us & Attend Free',
          primary_cta_url: '/join-us',
          secondary_cta_label: 'Get Updates',
          secondary_cta_url: '/contact',
        },
      },
      {
        key: 'programmes_intro',
        label: 'Our Programmes',
        description: 'Copy + image on the homepage Programmes strip. Featured programme still comes from the Programmes CRUD.',
        fields: [
          { key: 'eyebrow',   label: 'Eyebrow',   type: 'text' },
          { key: 'paragraph', label: 'Paragraph', type: 'textarea' },
          { key: 'cta_label', label: 'Button label', type: 'text' },
          { key: 'cta_url',   label: 'Button URL',   type: 'url' },
          { key: 'image_url', label: 'Fallback image (if no featured programme)', type: 'image' },
        ],
        defaults: {
          eyebrow: 'Our programmes',
          paragraph: 'We support the career development and success of Black academics across the UK by empowering universities, corporations, and research institutions with the insights, recommendations and support to implement authentic and effective diversity initiatives.',
          cta_label: 'Learn more',
          cta_url: '/resources',
          image_url: '',
        },
      },
      {
        key: 'impact',
        label: 'Our Impact',
        description: 'Stat band on the homepage. Edit eyebrow, intro and the three stats.',
        fields: [
          { key: 'eyebrow',  label: 'Eyebrow',  type: 'text' },
          { key: 'intro',    label: 'Intro paragraph', type: 'textarea' },
          { key: 'stat_1_number', label: 'Stat 1 — number', type: 'text' },
          { key: 'stat_1_label',  label: 'Stat 1 — label',  type: 'textarea' },
          { key: 'stat_2_number', label: 'Stat 2 — number', type: 'text' },
          { key: 'stat_2_label',  label: 'Stat 2 — label',  type: 'textarea' },
          { key: 'stat_3_number', label: 'Stat 3 — number', type: 'text' },
          { key: 'stat_3_label',  label: 'Stat 3 — label',  type: 'textarea' },
          { key: 'image_url', label: 'Background image', type: 'image' },
        ],
        defaults: {
          eyebrow: 'Our impact',
          intro: 'The Society of Black Academics was founded in 2020. Since then, we have worked with some of the most influential institutions in UK higher education to support the success of Black academics.',
          stat_1_number: '800+',
          stat_1_label: 'Black academics supported through our conferences, workshops, and mentorship programmes.',
          stat_2_number: '15',
          stat_2_label: 'UK universities and institutions partnered with to advance diversity in higher education.',
          stat_3_number: '1000+',
          stat_3_label: 'Networking opportunities provided to community members across the UK and beyond.',
          image_url: '',
        },
      },
      {
        key: 'newsletter',
        label: 'Newsletter',
        fields: [
          { key: 'headline',    label: 'Headline',    type: 'text' },
          { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
          { key: 'footnote',    label: 'Footnote',    type: 'text' },
        ],
        defaults: {
          headline: 'Stay Connected',
          subheadline: 'Join our mailing list to receive updates on programmes, events, and resources designed to support Black academics in their journey.',
          footnote: 'We respect your privacy. Unsubscribe at any time.',
        },
      },
    ],
  },

  {
    key: 'about',
    label: 'About',
    sections: [
      { key: 'hero', label: 'Hero', fields: heroFields(), defaults: {
        eyebrow: 'About Us',
        headline: 'Driving Change in Higher Education.',
        subheadline: 'The Society of Black Academics (SBA) was formed due to the under-representation of Black academics at the Professorial and Senior Leadership levels in UK Universities.',
        image_url: '', cta_label: '', cta_url: '',
      }},
      { key: 'why_sba', label: 'Why SBA', fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'paragraph_1', label: 'Paragraph 1', type: 'textarea' },
        { key: 'paragraph_2', label: 'Paragraph 2', type: 'textarea' },
        { key: 'callout_title', label: 'Callout title', type: 'text' },
        { key: 'callout_body',  label: 'Callout body',  type: 'textarea' },
      ], defaults: {
        eyebrow: 'Why SBA',
        headline: 'Building a more inclusive academy.',
        paragraph_1: 'Since our inception in 2021, we have launched several impactful initiatives and organized numerous events (including Workshops and Conferences) with the goal of promoting Equality, Diversity, and Inclusion (EDI) in the UK\'s Higher Education sector.',
        paragraph_2: 'Through the development of EDI and career development programmes, safe spaces for learning and knowledge exchange, as well as other progressive campaigns, we are improving the career advancement of Black academics.',
        callout_title: 'What we are doing currently',
        callout_body: 'Through the development of EDI and career development programmes, safe spaces for learning and knowledge exchange, as well as other progressive campaigns, we are attempting to improve the career advancement of Black academics. Our goal is to increase the number of Black academics employed at the professorial and senior leadership levels in the UK\'s higher education system.',
      }},
      { key: 'mvv', label: 'Mission / Vision / Values', fields: [
        { key: 'mission_title', label: 'Mission title', type: 'text' },
        { key: 'mission_body',  label: 'Mission body',  type: 'textarea' },
        { key: 'vision_title',  label: 'Vision title',  type: 'text' },
        { key: 'vision_body',   label: 'Vision body',   type: 'textarea' },
        { key: 'values_title',  label: 'Values title',  type: 'text' },
        { key: 'values_body',   label: 'Values body',   type: 'textarea' },
      ], defaults: {
        mission_title: 'Our Mission',
        mission_body: 'We continue to identify prevalent issues confronting Black academics in the Higher Education sector and address them by providing a safe space for personal reflection, knowledge sharing and dialogue, collaboration, and networking.',
        vision_title: 'Our Vision',
        vision_body: 'Justice, Equity, and Fairness (JEF) are at the heart of SBA\'s values. We aim to see a better level of JEF embedded in the progression opportunities for Black scholars in the UK\'s Higher Education sector.',
        values_title: 'Our Values',
        values_body: 'We promote Justice (broader ethical standards), Equity (equal opportunities and inclusivity), and Fairness (specific outcomes and treatment).',
      }},
      { key: 'team_intro', label: 'Team intro', fields: [
        { key: 'eyebrow',  label: 'Eyebrow',  type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
      ], defaults: {
        eyebrow: 'Our Team',
        headline: 'Meet Our Team',
        subheadline: 'Our team is made up of academics and practitioners from various fields who are enthusiastic about advancing the progression of Black academics.',
      }},
      { key: 'partners_cta', label: 'Partners CTA', fields: [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
        { key: 'button_label', label: 'Button label', type: 'text' },
      ], defaults: {
        headline: 'Become Our Partner',
        subheadline: 'Ready to team up with us? Let\'s create impact together and explore exciting sponsorship and partnership possibilities.',
        button_label: 'Become a Partner / Sponsor',
      }},
    ],
  },

  {
    key: 'contact',
    label: 'Contact',
    sections: [
      { key: 'hero', label: 'Hero', fields: heroFields(), defaults: {
        eyebrow: 'Get in Touch',
        headline: "We'd Love to Hear From You.",
        subheadline: "Whether you have questions about membership, partnerships, or want to get involved, we're here to help.",
        image_url: '', cta_label: '', cta_url: '',
      }},
      { key: 'info', label: 'Contact info', fields: [
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'hours_weekday', label: 'Weekday hours', type: 'text' },
        { key: 'hours_weekend', label: 'Weekend hours', type: 'text' },
        { key: 'response_note', label: 'Response note', type: 'text' },
      ], defaults: {
        email: 'info@societyofblackacademics.com',
        phone: 'Available upon request',
        location: 'United Kingdom',
        hours_weekday: 'Monday - Friday: 9:00 AM - 5:00 PM (GMT)',
        hours_weekend: 'Saturday - Sunday: Closed',
        response_note: 'We aim to respond to all inquiries within 48 hours during business days.',
      }},
    ],
  },

  {
    key: 'join-us',
    label: 'Join Us',
    sections: [
      { key: 'hero', label: 'Hero', fields: heroFields(), defaults: {
        eyebrow: 'Join Our Community',
        headline: 'Become a Member.',
        subheadline: 'Join our community of scholars, researchers, and educators committed to driving inclusive change in higher education.',
        image_url: '', cta_label: '', cta_url: '',
      }},
      { key: 'why_join', label: 'Why join', fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'benefit_1', label: 'Benefit 1', type: 'text' },
        { key: 'benefit_2', label: 'Benefit 2', type: 'text' },
        { key: 'benefit_3', label: 'Benefit 3', type: 'text' },
        { key: 'benefit_4', label: 'Benefit 4', type: 'text' },
      ], defaults: {
        eyebrow: 'Why Join',
        headline: 'Benefits of SBA Membership',
        benefit_1: 'Exposure to best practices, guidance, information, and a growing professional community',
        benefit_2: 'Commitment to driving change and promoting Justice, Equity, and Fairness (JEF)',
        benefit_3: 'Improved career prospects and exposure to exciting opportunities',
        benefit_4: 'Access to a diverse network of academics at different career stages',
      }},
      { key: 'levels_intro', label: 'Membership levels intro', fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
      ], defaults: { eyebrow: 'Membership Levels', headline: 'Choose Your Path' }},
      { key: 'apply_intro', label: 'Apply intro', fields: [
        { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
      ], defaults: {
        eyebrow: 'Apply Now', headline: 'Support Us',
        subheadline: "Support us and you'll get to attend our conference for free.",
      }},
    ],
  },

  {
    key: 'programs',
    label: 'Programs',
    sections: [
      { key: 'hero', label: 'Hero', fields: heroFields(), defaults: {
        eyebrow: 'Our Programmes', headline: 'Programmes that drive change.',
        subheadline: '', image_url: '', cta_label: '', cta_url: '',
      }},
    ],
  },

  {
    key: 'resources',
    label: 'Resources',
    sections: [
      { key: 'hero', label: 'Hero', fields: heroFields(), defaults: {
        eyebrow: 'Resources', headline: 'Reports, updates and research.',
        subheadline: '', image_url: '', cta_label: '', cta_url: '',
      }},
    ],
  },

  {
    key: 'gallery',
    label: 'Gallery',
    sections: [
      { key: 'hero', label: 'Hero', fields: [
        ...heroFields(),
        { key: 'featured_item_id', label: 'Hero image from gallery (overrides Background image)', type: 'gallery_item',
          help: 'When set, the hero uses this gallery item\'s image instead of the uploaded background image.' },
      ], defaults: {
        eyebrow: 'Our Moments', headline: 'Capturing Excellence.',
        subheadline: 'Explore moments from our conferences, workshops, and community gatherings.',
        image_url: '', cta_label: '', cta_url: '', featured_item_id: null,
      }},
      { key: 'past_events_intro', label: 'Past events intro',
        description: 'Heading above the photo grid. Use the curated list to pick exactly which photos appear, in order; leave it empty to show every visible gallery item.',
        fields: [
          { key: 'eyebrow',  label: 'Eyebrow',  type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'curated_items', label: 'Curated photos', type: 'gallery_items',
            help: 'Pick gallery items to feature, drag-order with the arrows, and toggle each one\'s visibility.' },
        ],
        defaults: { eyebrow: 'Gallery', headline: 'Photos from Past Events', curated_items: [] },
      },
    ],
  },
];

export const getPageSchema = (pageKey: string) =>
  PAGE_SCHEMAS.find(p => p.key === pageKey);

export const getSectionSchema = (pageKey: string, sectionKey: string) =>
  getPageSchema(pageKey)?.sections.find(s => s.key === sectionKey);
