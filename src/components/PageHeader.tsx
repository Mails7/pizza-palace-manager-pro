
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  actionLabel, 
  actionHref, 
  actionIcon,
  onAction,
  children 
}) => {
  const ActionIcon = actionIcon || Plus;

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        {children}
        {actionLabel && (
          <>
            {actionHref ? (
              <Button asChild className="bg-black hover:bg-gray-800 text-white">
                <Link to={actionHref}>
                  <ActionIcon className="mr-2 h-4 w-4" />
                  {actionLabel}
                </Link>
              </Button>
            ) : onAction ? (
              <Button 
                onClick={onAction}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <ActionIcon className="mr-2 h-4 w-4" />
                {actionLabel}
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
