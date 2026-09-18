import { Card, CardContent } from "../ui/card";

interface Props {
  externalId: string;
}

export function ImageComparison({ externalId }: Props) {
  const imageUrl = `${import.meta.env.VITE_API_BASE_URL}/observations/${externalId}/image`;

  return (
    <Card className="h-full min-h-0 overflow-hidden rounded-sm">
      <CardContent>
        <img
          src={imageUrl}
          alt={`Observation ${externalId}`}
          className="h-full w-full object-contain"
        />
      </CardContent>
    </Card>
  );
}
