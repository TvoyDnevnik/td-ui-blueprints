function ValidateColorVariant(value: string): value is ComponentColorVariant {
	return ComponentColorVariant.includes(<any>value);
}

const ComponentColorMap = new Map<ComponentColorVariant, string>([
	["primary", "primary"],
	["accent", "accent"],
	["warn", "cwarn"],
	["disabled", "cdisabled"],
]);

export function ColorVariant(
	variant?: string,
	fallback: ComponentColorVariant = "primary"
): string {
	return ComponentColorMap.get(
		ValidateColorVariant(variant) ? variant : fallback
	);
}

export function ColorShade(shade?: string, roundUp?: boolean): string {
	const shade_numeric = parseFloat(shade);

	if (shade_numeric >= 900) return "900";
	if (shade_numeric <= 100) return "100";

	const round =
		roundUp === false ? Math.floor : roundUp === true ? Math.ceil : Math.round;
	return (round(shade_numeric / 100) * 100).toString();
}

export function GetColorString(variant?: string, shade?: string): string {
	return `var(--${ColorVariant(variant)}-${ColorShade(shade)})`;
}

export function GetTextColorString(
	variant?: string,
	bg_shade?: string
): string {
	const shade_numeric = parseFloat(bg_shade);

	return `var(--text-${shade_numeric >= 500 ? "after-500" : "upto-400"}${
		ColorVariant(variant) === ComponentColorMap.get("disabled")
			? "-disabled"
			: ""
	})`;
}

export const ComponentColorVariant = [
	"primary",
	"accent",
	"warn",
	"disabled",
] as const;
export type ComponentColorVariant = (typeof ComponentColorVariant)[number];
