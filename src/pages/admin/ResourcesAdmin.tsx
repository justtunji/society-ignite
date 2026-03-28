import { useState } from 'react';
import CrudPage from './CrudPage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Eye } from 'lucide-react';

const resourceTypeOptions = [
  { label: 'SBA Update', value: 'sba-update' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Video', value: 'Video' },
  { label: 'Guide', value: 'Guide' },
];

const ResourcesAdmin = () => {
  const [previewItem, setPreviewItem] = useState<any>(null);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <CrudPage
        title="Resources"
        tableName="resources"
        orderBy="published_at"
        orderAsc={false}
        fields={[
          { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
          { name: 'slug', label: 'Slug', type: 'text' },
          { name: 'description', label: 'Description', type: 'richtext', showInTable: true },
          { name: 'resource_type', label: 'Type', type: 'select', options: resourceTypeOptions, defaultValue: 'PDF', showInTable: true },
          { name: 'featured', label: 'Featured (Pin to top)', type: 'boolean', defaultValue: false, showInTable: true },
          { name: 'thumbnail_url', label: 'Thumbnail', type: 'image', showInTable: true },
          { name: 'file_url', label: 'File URL', type: 'url' },
          { name: 'published_at', label: 'Published At', type: 'datetime' },
          { name: 'year', label: 'Year', type: 'number' },
          { name: 'topics', label: 'Topics', type: 'tags' },
        ]}
        customActions={(item: any) =>
          item.resource_type === 'sba-update' ? (
            <Button size="icon" variant="ghost" title="Preview" onClick={() => setPreviewItem(item)}>
              <Eye size={16} />
            </Button>
          ) : null
        }
      />

      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold truncate">
                  {previewItem?.title}
                </DialogTitle>
                {previewItem?.published_at && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(previewItem.published_at)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {previewItem?.featured && (
                  <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                )}
                {previewItem?.file_url && (
                  <Button size="sm" variant="outline" className="rounded-full" asChild>
                    <a href={previewItem.file_url} download>
                      <Download className="h-4 w-4 mr-1.5" />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-100px)]">
            <div className="px-6 py-6">
              {previewItem?.description ? (
                <div
                  className="prose prose-sm max-w-none
                    prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-3
                    prose-h2:text-2xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:text-accent
                    prose-p:text-foreground/80 prose-p:leading-relaxed
                    prose-li:text-foreground/80
                    prose-strong:text-foreground
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: previewItem.description }}
                />
              ) : (
                <p className="text-muted-foreground text-center py-8">No content to preview yet.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResourcesAdmin;
