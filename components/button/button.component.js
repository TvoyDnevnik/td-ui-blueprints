export class Button extends HTMLElement {
	/**
	 * Core button container that stores the button itself and stuff needed for ripple to work.
	 * @type {HTMLDivElement}
	 */
	#button_container;

	/**
	 * The underlying native button element.
	 * @type {HTMLButtonElement}
	 */
	#button;

	/**
	 * Container that holds ripple and ensures proper effect display.
	 * @type {HTMLDivElement}
	 */
	#ripple_container;

	/**
	 * The ripple itself. Gets repositioned and animated on each button click.
	 * @type {HTMLDivElement}
	 */
	#ripple;

	/**
	 * Ripple animation. Should be played whenever the button is clicked.
	 * @type {Animation}
	 */
	#ripple_animation;
	/**
	 * Used in a final animation to scale the ripple.
	 * Literally becomes: CSS
	 * ```css
	 * transform: scale(${ripple_scale});
	 * ```
	 * @type {number}
	 */
	#ripple_scale = 6;

	constructor() {
		super();

		const dom = this.attachShadow({ mode: "open" });

		// Append button handler script and button styles
		const css = document.createElement("link");
		css.rel = "stylesheet";
		css.href = "./components/button/css/button.css";
		dom.appendChild(css);

		// Setup main container
		this.#button_container = document.createElement("div");
		this.#button_container.classList.add("button_container");

		this.#setupColors();

		// Setup button itself
		const button_text = this.getAttribute("data-text") ?? "";
		this.#button = document.createElement("button");
		this.#button.type = "button";
		this.#button.classList.add("button");
		this.#button.id = "button";
		this.#button.innerText = button_text;

		// Setup ripple container and ripple element
		this.#ripple_container = document.createElement("div");
		this.#ripple_container.classList.add("ripple_container");
		this.#ripple_container.id = "ripple_container";

		this.#ripple = document.createElement("div");
		this.#ripple.classList.add("button_ripple");
		this.#ripple.id = "button_ripple";

		// Setup ripple animation
		this.#ripple_animation = this.#ripple.animate(
			[
				{ transform: "scale(1)" },
				{ transform: `scale(${this.#ripple_scale})` },
				{ opacity: "0", transform: `scale(${this.#ripple_scale})` },
			],
			500
		);
		this.#ripple_animation.cancel(); // We reset right away as we are just setting things up.

		// Append children to their respective parents.
		this.#ripple_container.appendChild(this.#ripple);

		this.#button_container.appendChild(this.#button);
		this.#button_container.appendChild(this.#ripple_container);

		dom.appendChild(this.#button_container);

		this.#setupEventListeners();
		// setupButtonScript(button, ripple_container, ripple);
	}

	#setupColors() {
		/**
		 * data-color attribute, specifies what color scheme to use for the button
		 * @type {"primary", "secondary", "warning", "error", "success", "disabled"}
		 */
		const color = this.getAttribute("data-color") ?? "primary";
		this.#button_container.style.setProperty(
			"--background",
			`var(--${color}-500)`
		);
		this.#button_container.style.setProperty("--ripple", `var(--${color}-200)`);
		this.#button_container.style.setProperty(
			"--outline",
			`var(--${color}-300)`
		);
	}

	#setupEventListeners() {
		this.#button_container.addEventListener("resize", (e) => {
			console.log(e);
		});

		this.#button.addEventListener("mousedown", () => {
			this.#buttonSetActive();
		});
		this.#button.addEventListener("keydown", (e) => {
			switch (e.code) {
				case "Space":
				case "Enter":
					this.#buttonSetActive();
					break;
				default:
					break;
			}
		});

		this.#button.addEventListener("mouseup", () => {
			this.#buttonUnsetActive();
		});
		this.#button.addEventListener("keyup", (e) => {
			switch (e.code) {
				case "Space":
				case "Enter":
					this.#buttonUnsetActive();
					break;
				default:
					break;
			}
		});

		this.#button.addEventListener("click", (e) => {
			if (this.#ripple_animation.playState === "running") return;
			this.#repositionRipple(e);

			requestAnimationFrame(() => {
				this.#ripple.style.display = "block";
				this.#ripple_animation.play();
				this.#ripple_animation.addEventListener("finish", () => {
					this.#ripple.style.display = "";
				});
			});
		});
	}

	/**
	 * When called with a proper argument, repositions ripple to the mouse click position or to the center of the button.
	 * @param {MouseEvent} e
	 */
	#repositionRipple(e) {
		const button_width = e.target.offsetWidth;
		const button_height = e.target.offsetHeight;

		const ripple_radius =
			e.target.clientHeight >= 0 ? e.target.clientHeight : 16;
		this.#ripple.style.width = `${ripple_radius}px`;
		this.#ripple.style.height = `${ripple_radius}px`;

		const { x: inner_x, y: inner_y } = this.#getInnerOffset(e);
		const ripple_x = inner_x > 0 ? inner_x : button_width / 2;
		const ripple_y = inner_y > 0 ? inner_y : button_height / 2;

		this.#ripple.style.left = `${ripple_x - ripple_radius / 2}px`;
		this.#ripple.style.top = `${ripple_y - ripple_radius / 2}px`;
	}

	/**
	 * Get inner offset like layerX/layerY.
	 * @param {MouseEvent} e
	 * @return {{x: number, y: number}}
	 */
	#getInnerOffset(e) {
		const bcr = e.target.getBoundingClientRect();
		return {
			x: Math.round(e.clientX - bcr.x),
			y: Math.round(e.clientY - bcr.y),
		};
	}

	#buttonSetActive() {
		const c = this.#button.classList;
		if (c.contains("active")) return;

		c.add("active");
	}

	#buttonUnsetActive() {
		const c = this.#button.classList;
		if (!c.contains("active")) return;

		c.remove("active");
	}
}
