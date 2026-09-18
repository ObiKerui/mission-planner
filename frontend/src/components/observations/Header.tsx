interface Props {
  externalId: string;
}

export function ObservationHeader({ externalId }: Props) {
  return (
    <div className="mb-4">
      <span className="text-xl">{externalId}</span>

      <span>Observed: —</span>
      <span>Filter: —</span>
      <span>Exposure: —</span>
    </div>
  );
}
