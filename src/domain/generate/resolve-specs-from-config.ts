import Handlebars from "handlebars";
import path from "path";
import moment from "moment";
import { advancedDeepmerge } from "./advanced-deepmerge.js";

const hb = Handlebars.create();

hb.registerHelper(
  "github",
  (handle) => `[github.com/${handle}](https://github.com/${handle})`,
);
hb.registerHelper(
  "linkedin",
  (handle) => `[linkedin.com/in/${handle}](https://linkedin.com/in/${handle})`,
);
hb.registerHelper("phone", (number: string) => {
  return `[${number}](tel:${String(number).replace(/\D/g, "")})`;
});
hb.registerHelper("email", (email) => `[${email}](mailto:${email})`);
hb.registerHelper("date", (format: string, originalDate?: string) =>
  moment(originalDate ?? new Date()).format(format),
);

const resolveTemplates = (
  config: any,
  handlebarVars: object = config,
  templateKey?: string,
): any => {
  if (templateKey === "locationFormat") {
    return config;
  }

  if (typeof config === "string") {
    const template = hb.compile(config);
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
      result[key] = resolveTemplates(value, handlebarVars, key);
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

// to resolve templates multiple times, e.g. for nested templates
const multiResolveTemplates = (config: any) => {
  return resolveTemplates(resolveTemplates(resolveTemplates(config)));
};

export const resolveSpecsFromConfig = (config: any, yamlFile: string) => {
  const additionalVars = {
    source: {
      path: yamlFile,
      name: path.basename(yamlFile, path.extname(yamlFile)),
      file: path.basename(yamlFile),
      dir: path.dirname(yamlFile),
      extension: path.extname(yamlFile),
    },
    env: process.env,
  };

  if (!config.variants) {
    return [multiResolveTemplates({ ...config, ...additionalVars })];
  }

  const { variants, ...baseSpec } = config;
  const variantCombinations = generateCartesianProduct(variants);

  const specs = variantCombinations.map((variantConfig) => {
    const mergedConfig = advancedDeepmerge(
      additionalVars,
      baseSpec,
      variantConfig,
    );
    return multiResolveTemplates(mergedConfig);
  });

  return specs;
};
