import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const allItems = [{ name: 'Home', url: '/' }, ...items];

  return (
    <>
      <BreadcrumbSchema items={allItems} />
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={item.url} className="flex items-center gap-2">
                {!isFirst && (
                  <ChevronRight size={14} className="text-muted-foreground" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="text-foreground font-medium flex items-center gap-1" aria-current="page">
                    {isFirst && <Home size={14} className="inline" />}
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
                  >
                    {isFirst && <Home size={14} className="inline" />}
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
