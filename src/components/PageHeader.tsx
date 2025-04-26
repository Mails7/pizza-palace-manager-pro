
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  actionLabel, 
  actionHref, 
  children 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        {actionLabel && actionHref && (
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link to={actionHref}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
