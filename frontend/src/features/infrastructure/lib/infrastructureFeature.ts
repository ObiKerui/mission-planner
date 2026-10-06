export interface InfrastructureFeature {
  osmId: number;
  layer: string;
  isNode: boolean;

  name?: string;
  operator?: string;

  construction: boolean;
  disused: boolean;

  location?: string;
  type?: string;

  voltage?: number;
  voltage2?: number;
  voltage3?: number;
  voltage4?: number;
  circuits?: number;
  frequency?: number;

  line?: string;
  substation?: string;
  source?: string;
  output?: number;
  method?: string;

  ref?: string;
  wikidata?: string;
  wikipedia?: string;
  url?: string;
  startDate?: string;
}

interface CesiumFeature {
  getProperty(name: string): unknown;
}

export function parseInfrastructureFeature(
  feature: CesiumFeature,
): InfrastructureFeature {
  const getString = (name: string) => {
    const value = feature.getProperty(name);

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "number" && Number.isNaN(value))
    ) {
      return undefined;
    }

    return String(value);
  };

  const getNumber = (name: string) => {
    const value = feature.getProperty(name);

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
  };

  const getBoolean = (name: string) => {
    return feature.getProperty(name) === true;
  };

  return {
    osmId: Number(feature.getProperty("osm_id")),
    layer: getString("_layer") ?? "",
    isNode: getBoolean("is_node"),

    name: getString("name"),
    operator: getString("operator"),

    construction: getBoolean("construction"),
    disused: getBoolean("disused"),

    location: getString("location"),
    type: getString("type"),

    voltage: getNumber("voltage"),
    voltage2: getNumber("voltage_2"),
    voltage3: getNumber("voltage_3"),
    voltage4: getNumber("voltage_4"),
    circuits: getNumber("circuits"),
    frequency: getNumber("frequency"),

    line: getString("line"),
    substation: getString("substation"),
    source: getString("source"),
    output: getNumber("output"),
    method: getString("method"),

    ref: getString("ref"),
    wikidata: getString("wikidata"),
    wikipedia: getString("wikipedia"),
    url: getString("url"),
    startDate: getString("start_date"),
  };
}
