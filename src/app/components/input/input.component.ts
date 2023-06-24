import { customElement, property } from "lit/decorators.js";
import { html, LitElement, nothing } from "lit";

import {
	ColorVariant,
	ComponentColorVariant,
} from "@shared/color-variant-processor";
import { HTMLBoolAttribute } from "@shared/bool-attribute.type";

import css from "./input.component.css";

@customElement("td-input")
export class TdInput extends LitElement {
	@property() declare label: string;
	@property() declare type: string;
	@property() declare color: ComponentColorVariant;
	@property() declare disabled: HTMLBoolAttribute;

	@property() declare autocomplete: string;

	private readonly label_size = "0.75em";

	static styles = css;

	constructor() {
		super();

		this.label = "";
		this.type = "text";
		this.color = "primary";
		this.disabled = undefined;
		this.autocomplete = "";
	}

	render() {
		return html`
			<style>
				.input_container {
					--input-color: var(--${ColorVariant(this.color)}-500);
				}
			</style>
			<div class="input_container" id="input_container">
				<div class="input_body" id="input_body">
					<label for="input" id="label">${this.label}</label>

					<slot name="prefix"></slot>
					<input
						type="${this.type}"
						id="input"
						@input="${this.activateInput}"
						@focusin="${this.activateInput}"
						@focusout="${this.deactivateInput}"
						autocomplete="${this.autocomplete || nothing}"
					/>
					<slot name="suffix"></slot>
				</div>
			</div>
		`;
	}

	private activateInput() {
		const label = this.labelEl;
		this.inputBodyEl.classList.add("active");

		label.style.opacity = "1";
		label.style.fontSize = this.label_size;

		label.style.top = `-${
			label.offsetHeight / 2 -
			this.getInputContainerPadding() -
			this.getFontDelta()
		}px`;
	}

	private deactivateInput() {
		const input = this.inputBodyEl;
		this.inputBodyEl.classList.remove("active");

		// Do not deactivate label if input has any data, placeholder or is currently focused.
		if (!this.shouldDeactivate()) return;

		const label = this.labelEl;
		label.style.fontSize = "";
		label.style.opacity = "0.5";

		label.style.top = `${
			this.getInputContainerPadding() +
			input.offsetHeight / 2 -
			label.offsetHeight / 2 -
			this.getFontDelta()
		}px`;
	}

	private shouldDeactivate(): boolean {
		const input = this.inputEl;
		return (
			!input.value &&
			!input.placeholder &&
			input.checkValidity() &&
			document.activeElement !== input
		);
	}

	private getInputContainerPadding(): number {
		return parseFloat(getComputedStyle(this.inputContainerEl).paddingTop);
	}

	private getFontDelta() {
		const font = parseFloat(getComputedStyle(this.inputContainerEl).fontSize);
		return font - font * parseFloat(this.label_size);
	}

	private get inputContainerEl(): HTMLDivElement {
		return this.renderRoot.querySelector("#input_container");
	}

	private get inputBodyEl(): HTMLInputElement {
		return this.renderRoot.querySelector("#input_body");
	}

	private get inputEl(): HTMLInputElement {
		return this.renderRoot.querySelector("#input");
	}

	private get labelEl(): HTMLLabelElement {
		return this.renderRoot.querySelector("#label");
	}
}
