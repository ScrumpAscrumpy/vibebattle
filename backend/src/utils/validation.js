import { HttpError } from "./httpError.js";

export function assertRequiredString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required`, {
      field: fieldName,
      code: "VALIDATION_ERROR",
    });
  }

  return value.trim();
}

export function assertOptionalString(value) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, "Invalid string value", {
      code: "VALIDATION_ERROR",
    });
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function assertPositiveInt(value, fieldName) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`, {
      field: fieldName,
      code: "VALIDATION_ERROR",
    });
  }

  return parsed;
}

export function assertEnum(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new HttpError(400, `${fieldName} must be one of: ${allowedValues.join(", ")}`, {
      field: fieldName,
      code: "VALIDATION_ERROR",
    });
  }

  return value;
}
