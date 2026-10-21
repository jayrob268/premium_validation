import { Selector } from 'testcafe';

export class BasePage {
  constructor(t) {
    this.t = t;
  }

  // Types into a field only when the scenario supplies a value.
  async fill(selector, value) {
    if (value === undefined || value === '') return;
    await this.t.typeText(selector, String(value), { replace: true });
  }

  // Picks an option from a dropdown by visible text, if a value is supplied.
  async choose(dropdownSelector, optionText) {
    if (optionText === undefined || optionText === '') return;
    await this.t.click(dropdownSelector);
    await this.t.click(Selector('[role="option"]').withText(optionText));
  }

  async tickIf(checkboxSelector, flag) {
    const wanted = String(flag).toLowerCase() === 'y';
    const current = await Selector(checkboxSelector).checked;
    if (current !== wanted) await this.t.click(checkboxSelector);
  }

  async next() {
    await this.t.click(Selector('button').withText('Next')); // TODO: confirm button label
  }
}
