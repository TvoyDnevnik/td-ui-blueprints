import { css } from "lit";

export default css`
  :host {
    --input-padding: 0.75em;
    --input-border-width: 3px;
    --label-padding: calc(var(--input-padding) + var(--input-border-width));
  }

  .input_container {
		width: max-content;
    position: relative;
  }

  .input_body {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
    border-radius: 1rem;
    border: solid var(--input-border-width) #e9e9e9;
    padding: var(--input-padding);

    transition: all 250ms ease-in-out;
  }

  input {
    outline: none;
    border: none;
  }

  label {
    pointer-events: none;
    position: absolute;
    left: var(--label-padding);
    padding: 0 0.175rem;
    background-color: white;
    opacity: 0.5;
    transition-property: font-size, top, opacity;
    transition-duration: 100ms;
    transition-timing-function: ease-in-out;
  }

  .input_body:hover,
  .input_body.active {
    border-width: var(--input-border-width);
    border-color: var(--input-color);
  }
`;