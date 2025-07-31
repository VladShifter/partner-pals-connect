import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tag {
  id: string;
  name: string;
  color_hex: string;
  category: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface TagCategoryDisplayProps {
  tags: Tag[];
  title?: string;
  showEmpty?: boolean;
}

export const TagCategoryDisplay = ({ 
  tags, 
  title = "Tags",
  showEmpty = false 
}: TagCategoryDisplayProps) => {
  // Group tags by category
  const tagsByCategory = tags.reduce((acc, tag) => {
    const category = tag.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  // Sort categories and tags within categories
  const sortedCategories = Object.keys(tagsByCategory).sort();

  if (tags.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCategories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tags assigned</p>
        ) : (
          sortedCategories.map((category) => {
            const categoryTags = tagsByCategory[category].sort((a, b) => a.sort_order - b.sort_order);
            
            return (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {categoryTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="text-xs text-white border-0"
                      style={{ backgroundColor: tag.color_hex }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};