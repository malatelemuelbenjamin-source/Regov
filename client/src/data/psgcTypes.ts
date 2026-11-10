export type PsgcLevel = "Reg" | "Prov" | "City" | "Mun" | "SubMun" | "SpecialGroup" | "Bgy";

export interface PsgcCounts {
  regions?: number;
  provinces?: number;
  cities?: number;
  municipalities?: number;
  barangays?: number;
  subMunicipalities?: number;
  specialGroupings?: number;
  componentCities?: number;
  sourceAssignedCities?: number;
  highlyUrbanizedCities?: number;
  independentComponentCities?: number;
  [key: string]: number | undefined;
}

export interface PsgcRecord {
  code: string;
  name: string;
  level: PsgcLevel;
  parentCode: string | null;
  regionCode: string;
  provinceCode: string | null;
  sourceLevel?: string;
  cityClass?: "HUC" | "ICC" | "CC";
  classification?: string;
  sourceName?: string;
  oldNames?: string;
  specialNote?: string;
  counts?: PsgcCounts;
  introduction?: string;
}

export interface PsgcMetadata {
  dataset: string;
  edition: string;
  asOf: string;
  published: string;
  lastVerified: string;
  sourceWorkbookName: string;
  sourceWorkbookUrl: string;
  sourcePageUrl: string;
  releaseNotesUrl: string;
  publicationsPageUrl: string;
  codeFormat: string;
  scopeNote: string;
  counts: {
    regions: number;
    provinces: number;
    cities: number;
    highlyUrbanizedCities: number;
    independentComponentCities: number;
    componentCities: number;
    municipalities: number;
    barangays: number;
    manilaSubMunicipalities: number;
    specialGroupings: number;
  };
}

export interface PsgcDataset {
  metadata: PsgcMetadata;
  country: { name: string; code: null; note: string };
  regions: PsgcRecord[];
  provinces: PsgcRecord[];
  localities: PsgcRecord[];
  specialGroups: PsgcRecord[];
  barangays: PsgcRecord[];
}

export interface PsgcRegionSummary {
  code: string;
  name: string;
  introduction: string;
  counts: Required<Pick<PsgcCounts, "provinces" | "cities" | "municipalities" | "barangays" | "subMunicipalities" | "specialGroupings">>;
}

export interface PsgcRegionSummaryFile {
  metadata: PsgcMetadata;
  regions: PsgcRegionSummary[];
}
