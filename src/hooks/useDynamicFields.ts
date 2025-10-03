import { useMemo } from "react";

type FieldTemplate = {
  [key: string]: any; // Define the structure of the template object as needed
  label: string;
};

type DynamicField = FieldTemplate & {
  fieldName: string;
  label: string;
};

/**
 * A custom hook to generate dynamic fields based on a parent value.
 *
 * @param {number | undefined} parentValue - The number of dynamic fields to generate.
 * @param {string} fieldName - The base name for the generated fields.
 * @param {FieldTemplate} fieldTemplate - The template object for each field.
 * Note: For optimal performance, memoize the fieldTemplate object to prevent unnecessary recalculations.
 * @returns {DynamicField[]} - Array of dynamically generated fields.
 *
 * @example
 * const fieldTemplate = useMemo(() => ({ label: "Item", value: "" }), []);
 * const fields = useDynamicFields(count, "items", fieldTemplate);
 */
const useDynamicFields = (
  parentValue: number | undefined,
  fieldName: string,
  fieldTemplate: FieldTemplate
): DynamicField[] =>
  useMemo(() => {
    if (!parentValue || typeof parentValue !== "number") return [];
    return Array.from({ length: parentValue }).map((_, index) => ({
      ...fieldTemplate,
      fieldName: `${fieldName}[${index}]`,
      label: `${fieldTemplate.label} ${index + 1}`,
    }));
  }, [parentValue, fieldName, fieldTemplate]);

export default useDynamicFields;
