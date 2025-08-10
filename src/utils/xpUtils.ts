/**
 * Calculates the required XP to reach the next level.
 * Formula: XP = 5 × (level²) + (50 × level) + 100
 * @param level - Current user level
 * @returns Required XP for the next level
 */
export function getRequiredXP(level: number): number {
    return (5 * (level ** 2)) + (50 * level) + 100;
}

/**
 * Checks if the user has leveled up.
 * @param currentXP - User's current XP
 * @param level - User's current level
 * @returns True if level-up condition is met
 */
export function hasLeveledUp(currentXP: number, level: number): boolean {
    return currentXP >= getRequiredXP(level);
}
