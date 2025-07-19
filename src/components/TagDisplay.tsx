import { Badge } from "@/components/ui/badge";

interface Tag {
  id: string;
  name: string;
  color_hex: string;
  category: string | null;
  is_featured: boolean;
  sort_order: number;
}

interface TagDisplayProps {
  tags: Tag[];
  maxTags?: number;
  showCategory?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'featured' | 'category';
}

export const TagDisplay = ({ 
  tags, 
  maxTags = 3, 
  showCategory = false, 
  size = 'sm',
  variant = 'default' 
}: TagDisplayProps) => {
  const displayTags = tags.slice(0, maxTags);
  const remainingCount = tags.length - maxTags;

  const getSizeClass = () => {
    switch (size) {
      case 'lg': return 'text-sm px-3 py-1';
      case 'md': return 'text-xs px-2 py-1';
      case 'sm': 
      default: return 'text-xs px-2 py-0.5';
    }
  };

  const getVariantClass = (tag: Tag) => {
    switch (variant) {
      case 'featured':
        return tag.is_featured ? 'text-white' : 'text-muted-foreground';
      case 'category':
        return 'text-foreground';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag) => (
        <Badge
          key={tag.id}
          className={`${getSizeClass()} ${getVariantClass(tag)} border-0`}
          style={{ backgroundColor: tag.color_hex }}
        >
          {showCategory && tag.category && (
            <span className="opacity-75 mr-1">{tag.category}:</span>
          )}
          {tag.name}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className={getSizeClass()}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};