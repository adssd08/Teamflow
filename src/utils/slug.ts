import crypto from 'node:crypto';

const MAX_SLUG_LENGTH = 255;
const SUFFIX_BYTES = 3;

export const createWorkspaceSlug = (
    name: string,
): string => {
    const suffix = crypto
        .randomBytes(SUFFIX_BYTES)
        .toString("hex");

    const reservedLength = suffix.length + 1;

    const maxBaseLength = MAX_SLUG_LENGTH - reservedLength;

    let base = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    base = base
        .slice(0, maxBaseLength)
        .replace(/-+$/g, "");

    if (!base) {
        base = "workspace";
    }

    return `${base}-${suffix}`;
}