import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function CandidatePanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          Select a detection to inspect the candidate
        </div>
      </CardContent>
    </Card>
  );
}
