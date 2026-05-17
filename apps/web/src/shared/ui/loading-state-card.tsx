import { Card, CardDescription, CardTitle } from "./card";
import { LoadingSpinner } from "./loading-spinner";

type LoadingStateCardProps = {
  title: string;
  description: string;
};

export function LoadingStateCard({ title, description }: LoadingStateCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <LoadingSpinner className="mt-0.5 h-6 w-6" />
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </Card>
  );
}

