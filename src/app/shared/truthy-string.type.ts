export const TruthyString = ["true", "yes", "on"];
export type TruthyString = (typeof TruthyString)[number];

export function isTruthyString(value: string): value is TruthyString {
	return TruthyString.includes(value);
}
