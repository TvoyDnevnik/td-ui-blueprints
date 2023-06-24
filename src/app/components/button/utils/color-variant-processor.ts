function ValidateColorVariant(value: string): value is ButtonColorVariant {
	return ButtonColorVariant.includes(<any>value);
}

export function ColorVariant(
	variant?: string,
	fallback: ButtonColorVariant = "primary"
): ButtonColorVariant {
	return ValidateColorVariant(variant) ? variant : fallback;
}

export const ButtonColorVariant = [
	"primary",
	"success",
	"warning",
	"error",
	"disabled",
] as const;
export type ButtonColorVariant = (typeof ButtonColorVariant)[number];
