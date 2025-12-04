
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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{title}</h1>
        {children}
      </div>
      <div className="flex items-center gap-4">
        {actionLabel && (
          <>
            {actionHref ? (
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-200 hover:scale-105">
                <Link to={actionHref}>
                  <ActionIcon className="mr-2 h-4 w-4" />
                  {actionLabel}
                </Link>
              </Button>
            ) : onAction ? (
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
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
