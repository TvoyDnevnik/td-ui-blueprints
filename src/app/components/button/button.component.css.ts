import { css } from "lit";

export default css`
  :host {
    /* Constant variables */
    --outline-width: 0.25rem;
    --outline-offset: 0.125rem;
  }

  .button_container {
    width: max-content;
    position: relative;
    --button-border-radius: 1rem;
  }

  .ripple_container {
    pointer-events: none;
    user-select: none;

    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: var(--button-border-radius);
  }

  .button {
    font-family: var(--root-font);
    font-size: 1.25rem;
    color: var(--td-button-text-color);
    background-color: var(--td-button-color);
    border: none;
    padding: 0.5rem 2rem;
    border-radius: var(--button-border-radius);
    cursor: pointer;
    outline: none;

    transition: transform 175ms ease-in-out;

    -webkit-tap-highlight-color: transparent;
  }

  .ripple {
    position: absolute;
    border-radius: 100%;
    background-color: var(--td-button-ripple-color);
    opacity: 0.5;
    display: none;
    width: 0;
    height: 0;
    z-index: 50;
  }

  .button:focus-visible {
    /* Apply dual shadow: first shadow acts as an offset and is of app-background color,
				 * second shadow is an actual outline, which ends up being 3px in width (to calculate,
				 * simply subtract the spread of the first shadow from the spread of the second shadow).
				 */
    box-shadow: 0 0 0 2px var(--app-background, #fff),
    0 0 0 5px var(--td-button-outline-color);
  }

  .button:not(:disabled).active {
    user-select: none;
    transform: scale(0.95);
  }

  .button:disabled {
    cursor: default;
  }
`;