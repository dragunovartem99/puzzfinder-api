import config from "@dragunovartem99/oxlint-config";

export default { ...config, ignorePatterns: [...(config.ignorePatterns ?? []), "types/api.d.ts"] };
