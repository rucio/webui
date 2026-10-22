import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// jsdom lacks these browser APIs, which Radix Select and Checkbox rely on.
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as unknown as { ResizeObserver: unknown }).ResizeObserver ??= ResizeObserverStub;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};

/** Open a Radix Select by its label and pick an option by its visible text. */
export const pick = async (label: string | RegExp, optionName: string | RegExp) => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(label));
    await user.click(await screen.findByRole('option', { name: optionName }));
};
