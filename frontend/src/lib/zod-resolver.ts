import type { FieldErrors, FieldValues, Resolver, ResolverResult } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * Lightweight Zod resolver for react-hook-form.
 * Avoids the extra @hookform/resolvers dependency.
 */
export function createZodResolver<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return (values): ResolverResult<TFieldValues, TFieldValues> => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errorMap: Record<string, { type: string; message: string }> = {};

    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "root";
      if (!errorMap[key]) {
        errorMap[key] = { type: "validation", message: issue.message };
      }
    }

    return {
      values: {} as Record<string, never>,
      errors: errorMap as unknown as FieldErrors<TFieldValues>,
    };
  };
}

