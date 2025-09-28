#!/usr/bin/env node
/**
 * fix_useChannelDetail.js — sustituye app/hooks/useChannelDetail.ts
 * por una implementación segura que evita el "Parsing error: ',' expected".
 *
 * Uso:
 *   node fix_useChannelDetail.js
 *   npm run build
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const target = path.join(ROOT, "app/hooks/useChannelDetail.ts");

const contents = `// app/hooks/useChannelDetail.ts
"use client";

import useSWR from "swr";

type ChannelDetail = {
  id: string;
  username: string;
  title?: string | null;
  // añade los campos reales que uses...
};

type ChannelDetailResponse = {
  ok: boolean;
  data?: ChannelDetail;
  error?: string;
};

const fetcher = async (url: string): Promise<ChannelDetailResponse> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    return { ok: false, error: \`HTTP \${res.status}\` };
  }
  const json: unknown = await res.json();

  if (!json || typeof json !== "object" || !("ok" in json)) {
    return { ok: false, error: "invalid_response" };
  }
  return json as ChannelDetailResponse;
};

/**
 * Hook para obtener detalle de canal por username.
 * - Cierra correctamente genéricos en useSWR
 * - Evita retornos con objetos mal formateados (comas/llaves)
 */
export function useChannelDetail(username: string | undefined) {
  const key = username ? \`/api/channels/\${encodeURIComponent(username)}\` : null;

  const { data, error, isLoading, mutate } = useSWR<ChannelDetailResponse>(
    key,
    fetcher,
    { revalidateOnFocus: true }
  );

  return {
    data: data?.data ?? null,
    ok: data?.ok ?? false,
    error: error ? (error as Error).message : data?.error ?? null,
    isLoading,
    mutate,
  };
}
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, contents, "utf8");
console.log("✅ Reemplazado:", path.relative(ROOT, target));
console.log("Ahora ejecuta: npm run build");
