import Handlebars from "handlebars";
import { z } from "zod";

/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

const itemWithId = z.object({
  $id: z.string(),
});

type RemoveInstruction = { $type: "remove"; value: string | number };
type RestInstruction = { $type: "rest" };
type MergeBehaviorInstruction = {
  $type: "merge";
  value: "concat" | "uniques" | "replace";
};
type Instruction =
  | RemoveInstruction
  | RestInstruction
  | MergeBehaviorInstruction;

const hb = Handlebars.create();
hb.registerHelper("remove", (value: any) =>
  JSON.stringify({ $type: "remove", value } satisfies Instruction),
);
hb.registerHelper("rest", () =>
  JSON.stringify({ $type: "rest" } satisfies Instruction),
);
hb.registerHelper("merge", (value: any) =>
  JSON.stringify({ $type: "merge", value } satisfies Instruction),
);
const isInstruction = (obj: any): obj is Instruction =>
  obj && typeof obj === "object" && !!obj.$type;

const applyMergeInstructions = (arr: any[]): (Instruction | unknown)[] =>
  arr.map((item) => {
    if (typeof item !== "string") return item;
    try {
      const parsed = hb.compile(item, { noEscape: true })({});
      const parsedJson = JSON.parse(parsed);
      if (!isInstruction(parsedJson)) {
        return item;
      }
      return parsedJson as Instruction;
    } catch {
      return item;
    }
  });

const getItemId = (item: unknown) => {
  if (typeof item === "object" && item !== null && "$id" in item) {
    return (item as { $id: string }).$id;
  }
  return "%%noid%%";
};

function arrayMerge(arr1: any[], arr2: any[]) {
  const appliedArr2 = applyMergeInstructions(arr2);
  const arr2Values = appliedArr2.filter(
    (value) => !isInstruction(value) || value.$type === "rest",
  );
  const removeItems = appliedArr2
    .filter((value) => isInstruction(value) && value.$type === "remove")
    .map((item) => (item as RemoveInstruction).value);
  const behaviorInstruction = appliedArr2.find(
    (value) => isInstruction(value) && value.$type === "merge",
  ) as MergeBehaviorInstruction | undefined;
  const behavior = behaviorInstruction?.value || "uniques";

  if (behavior === "replace") {
    return arr2Values;
  }

  const filteredArr1 = arr1
    .filter(
      (item, index) =>
        !removeItems.includes(item) &&
        !removeItems.includes(index) &&
        !removeItems.includes(getItemId(item)),
    )
    .filter((item) =>
      behavior === "concat" ? true : !arr2Values.includes(item),
    )
    .map((item) => {
      const parsed = itemWithId.safeParse(item);
      if (!parsed.success) return item;
      const arr2Match = arr2Values.find(
        (arr2Item) =>
          itemWithId.safeParse(arr2Item).data?.$id === parsed.data.$id,
      );
      if (!arr2Match) return item;
      arr2Values.splice(arr2Values.indexOf(arr2Match), 1); // remove from arr2
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return mergeTwo(item, arr2Match);
    });

  const insertionIndex =
    arr2Values.findIndex(
      (value) => isInstruction(value) && value.$type === "rest",
    ) || arr2Values.length;

  const result = [
    ...arr2Values.slice(0, insertionIndex),
    ...filteredArr1,
    ...arr2Values.slice(insertionIndex),
  ].filter((item) => !isInstruction(item));
  return result;
}

const isObject = (obj: any) => {
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }

    return Object.prototype.toString.call(obj) === "[object Object]";
  }

  return false;
};

// object2 overwrites object1
function mergeTwo(object1: any, object2: any | undefined) {
  if (object2 === undefined) {
    return object1;
  }

  Object.keys(object2).forEach((key) => {
    if (["__proto__", "constructor", "prototype"].includes(key)) {
      return;
    }

    if (Array.isArray(object1[key]) && Array.isArray(object2[key])) {
      object1[key] = arrayMerge(object1[key], object2[key]);
    } else if (isObject(object1[key]) && isObject(object2[key])) {
      object1[key] = mergeTwo(object1[key], object2[key]);
    } else if (!isObject(object1[key]) && isObject(object2[key])) {
      object1[key] = mergeTwo(object2[key], undefined);
    } else {
      object1[key] =
        object2[key] === undefined || object2[key] === null
          ? null
          : object2[key];
    }
  });

  return object1;
}

export const advancedDeepmerge = (...objects: any[]): any => {
  const result = objects.reduce(
    (result, current) => mergeTwo(result, current),
    {},
  ) as any;
  return result;
};
