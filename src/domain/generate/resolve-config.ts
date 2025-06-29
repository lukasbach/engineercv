import Handlebars from "handlebars";
import { buildComponentRegistry } from "../../components/default-components.js";
import { merge } from "./deepmerge.js";

const resolveTemplates = (config: any, fullSpec: object = config): any => {
  if (typeof config === "string") {
    const template = Handlebars.compile(config);
    const resolved = template(fullSpec);
    try {
      return JSON.parse(resolved);
    } catch {
      return resolved;
    }
  }

  if (Array.isArray(config)) {
    return config.map((item) => resolveTemplates(item, fullSpec));
  }

  if (config && typeof config === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      result[key] = resolveTemplates(value, fullSpec);
    }
    return result;
  }

  return config;
};

const generateCartesianProduct = (
  variants: Record<string, object[]>,
): Record<string, unknown>[] => {
  const dimensions = Object.keys(variants);

  if (dimensions.length === 0) {
    return [{}];
  }

  const [firstDimension, ...restDimensions] = dimensions;
  const firstValues = variants[firstDimension];
  const restVariants = Object.fromEntries(
    restDimensions.map((key) => [key, variants[key]]),
  );
  const restCombinations = generateCartesianProduct(restVariants);

  const result: Record<string, unknown>[] = [];

  for (const value of firstValues) {
    for (const restCombination of restCombinations) {
      result.push({
        ...value,
        ...restCombination,
      });
    }
  }

  return result;
};

export const resolveConfig = (config: unknown) => {
  const components = buildComponentRegistry();
  const spec = components.specSchema.parse(config);

  if (!spec.variants) {
    return { components, specs: [resolveTemplates(spec)] };
  }

  const { variants, ...baseSpec } = spec;
  const variantCombinations = generateCartesianProduct(variants);

  const specs = variantCombinations.map((variantConfig) => {
    const mergedConfig = merge(baseSpec, variantConfig);
    return resolveTemplates(mergedConfig);
  });

  return { components, specs };
};
