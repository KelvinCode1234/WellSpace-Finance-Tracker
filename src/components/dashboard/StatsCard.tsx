import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function StatsCard({ title, value, icon: Icon, onClick }: StatsCardProps) {
  return (
    <Card className={cn("transition-all duration-300", onClick && "cursor-pointer hover:bg-card/80 hover:border-primary/50")} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
