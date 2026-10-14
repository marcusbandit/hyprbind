import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { homeDir } from "@tauri-apps/api/path";

// Parsed binds interface
export interface BindEntry {
  type: string;
  mod: string[];
  key: string;
  dispatcher: string;
  parameter: string | null;
  raw: string;
}

/** Read hyprbinds.conf via filesystem plugin */
export async function readHyprbindConf(path?: string): Promise<string> {
  const p = path ?? `${await homeDir()}/.config/hypr/hyprbinds.conf`;
  return await readTextFile(p, {});
}

/** Write hyprbinds.conf via filesystem plugin */
export async function writeHyprbindConf(content: string, path?: string): Promise<void> {
  console.log("writing config");
  const p = path ?? `${await homeDir()}/.config/hypr/hyprbinds.conf`;
  console.log("writing config to", p);
  await writeTextFile(p, content, {});
  console.log("config written");
}
