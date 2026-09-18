import { DetectionList } from "@/components/observations/DetectionList";
import { ObservationHeader } from "@/components/observations/Header";
import { ImageComparison } from "@/components/observations/ImageComparison";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/observations/$externalId")({
  component: RuleDetailPage,
});

function RuleDetailPage() {
  const { externalId } = Route.useParams();

  return (
    <main className="h-full min-h-0 px-4 pb-4 pt-2">
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-w-0 flex-1">
          <ImageComparison externalId={externalId} />
        </div>
        <aside className="h-full w-80 shrink-0">
          <Card className="h-full rounded-sm">
            <CardContent className="h-full p-4">
              <ObservationHeader externalId={externalId} />
              <DetectionList externalId={externalId} />
            </CardContent>
          </Card>
        </aside>{" "}
      </div>
    </main>
  );
}
