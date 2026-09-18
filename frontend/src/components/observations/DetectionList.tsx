import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  externalId: string;
}

export function DetectionList({ externalId }: Props) {
  return (
    <div>
      <span>Detections</span>
      <span>Detections for {externalId}</span>
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        No detections loaded
      </div>
    </div>
  );
}
