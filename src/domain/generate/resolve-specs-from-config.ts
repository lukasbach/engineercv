import Handlebars from "handlebars";
import path from "path";
import { advancedDeepmerge } from "./advanced-deepmerge.js";

Handlebars.registerHelper(
  "github",
  (handle) => `[github.com/${handle}](https://github.com/${handle})`,
);
Handlebars.registerHelper(
  "linkedin",
  (handle) => `[linkedin.com/in/${handle}](https://linkedin.com/in/${handle})`,
);
Handlebars.registerHelper("phone", (number: string) => {
  return `[${number}](tel:${String(number).replace(/\D/g, "")})`;
});
Handlebars.registerHelper("email", (email) => `[${email}](mailto:${email})`);

const resolveTemplates = (config: any, handlebarVars: object = config): any => {
  if (typeof config === "string") {
    const template = Handlebars.compile(config);
    const resolved = template(handlebarVars);
    try {
      return JSON.parse(resolved);
    } catch {
      return resolved;
    }
  }

  if (Array.isArray(config)) {
    return config.map((item) => resolveTemplates(item, handlebarVars));
  }

  if (config && typeof config === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(config)) {
      result[key] = resolveTemplates(value, handlebarVars);
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

export const resolveSpecsFromConfig = (config: any, yamlFile: string) => {
  const additionalVars = {
    source: {
      path: yamlFile,
      name: path.basename(yamlFile, path.extname(yamlFile)),
    },
  };

  if (!config.variants) {
    return [resolveTemplates({ ...config, ...additionalVars })];
  }

  const { variants, ...baseSpec } = config;
  const variantCombinations = generateCartesianProduct(variants);

  const specs = variantCombinations.map((variantConfig) => {
    const mergedConfig = advancedDeepmerge(baseSpec, variantConfig);
    return resolveTemplates(mergedConfig);
  });

  return specs;
};
