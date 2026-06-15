// Invalid fixtures for the third-party rules the preset configures on plain .ts.

// @typescript-eslint/naming-convention: enum not PascalCase, member not
// UPPER_CASE, interface not PascalCase, type alias not PascalCase
export enum direction {
    Up = "up",
}

export interface userProfile {
    id: number;
}

export type userId = string;

// arrow-body-style: concise body instead of an explicit block
export const identity = () => 1;
