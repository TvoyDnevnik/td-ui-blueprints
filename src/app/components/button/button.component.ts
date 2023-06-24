import { customElement, property } from "lit/decorators.js";
import { html, LitElement } from "lit";

import css from "./button.component.css";

import {
	ComponentColorVariant,
	ColorVariant,
} from "@shared/color-variant-processor";
import { isTruthyString } from "@shared/truthy-string.type";
import { HTMLBoolAttribute } from "@shared/bool-attribute.type";

@customElement("td-button")
export class TdButton extends LitElement {
	// Configuration properties
	@property() declare text: string;
	@property() declare color: ComponentColorVariant;
	@property() declare disabled: HTMLBoolAttribute;

	private readonly ripple_scale = 6;

	private _rippleAnimation?: Animation;

	static styles = css;

	constructor() {
		super();
		this.text = "";
		this.color = "primary";
		this.disabled = undefined;
	}

	render() {
		return html`
			<style>
				.button_container {
					--td-button-color: var(
						--${this.isDisabled(this.disabled)
							? "disabled"
							: ColorVariant(this.color)}-500
					);
					--td-button-ripple-color: var(
						--${this.isDisabled(this.disabled)
							? "disabled"
							: ColorVariant(this.color)}-200
					);
					--td-button-outline-color: var(
						--${this.isDisabled(this.disabled)
							? "disabled"
							: ColorVariant(this.color)}-500
					);
					--td-button-text-color: var(
						--${this.isDisabled(this.disabled)
							? "disabled"
							: ColorVariant(this.color)}-100
					);
				}
			</style>
			<div class="button_container">
				<button
					type="button"
					class="button"
					id="button"
					?disabled="${this.isDisabled(this.disabled)}"
					@click="${this.buttonClicked}"
					@pointerdown="${this.handleButtonActivation}"
					@keydown="${this.handleButtonActivation}"
					@pointerup="${this.handleButtonDeactivation}"
					@pointerleave="${this.handleButtonDeactivation}"
					@keyup="${this.handleButtonDeactivation}"
				>
					${this.text}
				</button>
				<div class="ripple_container">
					<div class="ripple" id="ripple"></div>
				</div>
			</div>
		`;
	}

	private buttonClicked(e: MouseEvent) {
		if (this.ripple_animation.playState === "running") return;
		this.repositionRipple(e);

		requestAnimationFrame(() => {
			this.ripple.style.display = "block";
			this.ripple_animation.play();
			this.ripple_animation.addEventListener("finish", () => {
				this.ripple.style.display = "";
			});
		});
	}

	private repositionRipple(e: MouseEvent) {
		const target = e.target as HTMLElement;

		const button_width = target.offsetWidth;
		const button_height = target.offsetHeight;

		const ripple_radius = target.clientHeight >= 0 ? target.clientHeight : 16;
		this.ripple.style.width = `${ripple_radius}px`;
		this.ripple.style.height = `${ripple_radius}px`;

		const { x: inner_x, y: inner_y } = this.getInnerOffset(e);
		const ripple_x = inner_x > 0 ? inner_x : button_width / 2;
		const ripple_y = inner_y > 0 ? inner_y : button_height / 2;

		this.ripple.style.left = `${ripple_x - ripple_radius / 2}px`;
		this.ripple.style.top = `${ripple_y - ripple_radius / 2}px`;
	}

	private getInnerOffset(e: MouseEvent): { x: number; y: number } {
		const target = e.target as HTMLElement;
		const bcr = target.getBoundingClientRect();
		return {
			x: Math.round(e.clientX - bcr.x),
			y: Math.round(e.clientY - bcr.y),
		};
	}

	private handleButtonActivation(e: MouseEvent | KeyboardEvent) {
		if (e instanceof MouseEvent) {
			this.setButtonActive();
			return;
		}

		switch (e.code) {
			case "Space":
			case "Enter":
				this.setButtonActive();
				break;
			default:
				break;
		}
	}

	private handleButtonDeactivation(e: MouseEvent | KeyboardEvent) {
		if (e instanceof MouseEvent) {
			this.unsetButtonActive();
			return;
		}

		switch (e.code) {
			case "Space":
			case "Enter":
				this.unsetButtonActive();
				break;
			default:
				break;
		}
	}

	private setButtonActive() {
		const c = this.button.classList;
		if (c.contains("active")) return;

		c.add("active");
	}

	private unsetButtonActive() {
		const c = this.button.classList;
		if (!c.contains("active")) return;

		c.remove("active");
	}

	private isDisabled(disabled: string): boolean {
		return disabled === "" || isTruthyString(disabled);
	}

	private get button(): HTMLButtonElement {
		return this.renderRoot.querySelector("#button");
	}

	private get ripple(): HTMLDivElement {
		return this.renderRoot.querySelector("#ripple");
	}

	private get ripple_animation(): Animation {
		// Create animation if not exists
		if (!this._rippleAnimation) {
			this._rippleAnimation = this.ripple.animate(
				[
					{ transform: "scale(1)" },
					{ transform: `scale(${this.ripple_scale})` },
					{ opacity: "0", transform: `scale(${this.ripple_scale})` },
				],
				500
			);
			this._rippleAnimation.cancel();
		}

		return this._rippleAnimation;
	}
}
