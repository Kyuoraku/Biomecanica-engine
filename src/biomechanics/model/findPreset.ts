import { PRESET_IDS, PRESETS, type PresetId } from "../../constants/presets";
import type { BodyParams } from "./bodyParams";

export function isPresetId(value: string): value is PresetId {
  return PRESET_IDS.some((id) => id === value);
}

export function findPreset(id: string): BodyParams | undefined {
  return isPresetId(id) ? PRESETS[id] : undefined;
}
