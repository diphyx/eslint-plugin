// Valid counterpart to utils/invalid/preset.ts for the third-party rules the
// preset configures on plain .ts: @typescript-eslint/naming-convention and
// arrow-body-style. So `pnpm run lint` reports zero warnings here.

// naming-convention: PascalCase enum/interface/type, UPPER_CASE enum members
export enum Direction {
    UP = "up",
    DOWN = "down",
}

export interface UserProfile {
    id: number;
}

export type UserId = string;

// arrow-body-style: explicit block body
export const identity = () => {
    return 1;
};
