function ValidateColorVariant(value: string): value is ComponentColorVariant {
	return ComponentColorVariant.includes(<any>value);
}

export function ColorVariant(
	variant?: string,
	fallback: ComponentColorVariant = "primary"
): ComponentColorVariant {
	return ValidateColorVariant(variant) ? variant : fallback;
}

export const ComponentColorVariant = [
	"primary",
	"success",
	"warning",
	"error",
	"disabled",
] as const;
export type ComponentColorVariant = (typeof ComponentColorVariant)[number];
