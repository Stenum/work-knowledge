import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function FeatureCard({ title, description, href, className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
          <p className="mt-2 text-sm text-zinc-600">{description}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>Open</Link>
        </Button>
      </div>
    </div>
  );
}
