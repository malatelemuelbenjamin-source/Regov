import { useEffect, useState } from "react";
import type { PsgcDataset } from "@/data/psgcTypes";

const GZIP_URL = "/data/psgc-2026-q3.json.gz";
const JSON_URL = "/data/psgc-2026-q3.json";
let cachedDataset: PsgcDataset | null = null;
let pendingLoad: Promise<PsgcDataset> | null = null;

function validateDataset(value: unknown): PsgcDataset {
  if (!value || typeof value !== "object") throw new Error("The PSA geographic file is not a JSON dataset.");
  const data = value as Partial<PsgcDataset>;
  if (!data.metadata || !Array.isArray(data.regions) || !Array.isArray(data.provinces) || !Array.isArray(data.localities) || !Array.isArray(data.specialGroups) || !Array.isArray(data.barangays)) {
    throw new Error("The PSA geographic file is missing a required hierarchy section.");
  }
  if (data.metadata.edition !== "Third Quarter 2026" || data.regions.length !== 18 || data.provinces.length !== 82 || data.barangays.length !== 42_010) {
    throw new Error("The PSGC file did not pass the expected Q3 2026 edition and source-count checks.");
  }
  return data as PsgcDataset;
}

async function fetchJson(url: string): Promise<PsgcDataset> {
  const response = await fetch(url, { cache: "force-cache", headers: { Accept: "application/json, application/gzip" } });
  if (!response.ok) throw new Error(`Unable to load the PSGC data file (HTTP ${response.status}).`);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const isRawGzip = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
  let text: string;
  if (isRawGzip) {
    if (typeof DecompressionStream === "undefined") throw new Error("This browser cannot decompress the compact PSGC file.");
    const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream("gzip"));
    text = await new Response(stream).text();
  } else {
    // Some static hosts automatically decode Content-Encoding:gzip responses.
    text = new TextDecoder("utf-8").decode(buffer);
  }
  return validateDataset(JSON.parse(text) as unknown);
}

async function loadDataset(): Promise<PsgcDataset> {
  try {
    return await fetchJson(GZIP_URL);
  } catch (compressedError) {
    try {
      return await fetchJson(JSON_URL);
    } catch {
      throw compressedError instanceof Error ? compressedError : new Error("Unable to load the PSA PSGC dataset.");
    }
  }
}

export function loadPsgcDataset(): Promise<PsgcDataset> {
  if (cachedDataset) return Promise.resolve(cachedDataset);
  if (!pendingLoad) {
    pendingLoad = loadDataset()
      .then((data) => {
        cachedDataset = data;
        return data;
      })
      .catch((error: unknown) => {
        pendingLoad = null;
        throw error;
      });
  }
  return pendingLoad;
}

export function usePsgcDataset() {
  const [data, setData] = useState<PsgcDataset | null>(cachedDataset);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadPsgcDataset().then((dataset) => {
      if (active) setData(dataset);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : "The PSGC data could not be loaded.");
    });
    return () => { active = false; };
  }, [attempt]);

  return { data, error, retry: () => { setError(null); setAttempt((value) => value + 1); } };
}
