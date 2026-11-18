import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-warm-gray">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-midnight"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only md:not-sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              <span className="text-gold" aria-hidden="true">
                /
              </span>
              {isLast || !item.href ? (
                <span className="text-midnight" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-midnight"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
