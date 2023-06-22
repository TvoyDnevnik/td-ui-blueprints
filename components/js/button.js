/* Button animation handling */
const button = document.getElementById("button");

const ripple_container = document.getElementById("ripple_container");
const ripple = document.getElementById("button_ripple");

function buttonSetActive() {
	const c = button.classList;
	if (c.contains("active")) return;

	c.add("active");
}

function buttonUnsetActive() {
	const c = button.classList;
	if (!c.contains("active")) return;

	c.remove("active");
}

button.addEventListener("mousedown", () => {
	buttonSetActive();
});
button.addEventListener("keydown", (e) => {
	switch (e.code) {
		case "Space":
		case "Enter":
			buttonSetActive();
			break;
		default:
			break;
	}
});

button.addEventListener("mouseup", () => {
	buttonUnsetActive();
});
button.addEventListener("keyup", (e) => {
	switch (e.code) {
		case "Space":
		case "Enter":
			buttonUnsetActive();
			break;
		default:
			break;
	}
});

function setupRipple(e) {
	const button_width = e.target.clientWidth;
	const button_height = e.target.clientHeight;
	ripple_container.style.width = `${button_width ?? 0}px`;
	ripple_container.style.height = `${button_height ?? 0}px`;

	const ripple_radius = e.target.clientHeight >= 0 ? e.target.clientHeight : 16;
	ripple.style.width = `${ripple_radius}px`;
	ripple.style.height = `${ripple_radius}px`;

	const ripple_x = e.layerX > 0 ? e.layerX : button_width / 2;
	const ripple_y = e.layerY > 0 ? e.layerY : button_height / 2;

	ripple.style.left = `${ripple_x - ripple_radius / 2}px`;
	ripple.style.top = `${ripple_y - ripple_radius / 2}px`;
}

const ripple_scale = 6;
const button_animation = ripple.animate(
	[
		{ transform: "scale(1)" },
		{ transform: `scale(${ripple_scale})` },
		{ opacity: "0", transform: `scale(${ripple_scale})` },
	],
	500
);
button_animation.cancel();

button.addEventListener("click", (e) => {
	if (button_animation.playState === "running") return;
	setupRipple(e);

	requestAnimationFrame(() => {
		ripple.style.display = "block";
		button_animation.play();
		button_animation.addEventListener("finish", () => {
			ripple.style.display = "";
		});
	});
});
