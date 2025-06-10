interface PanelOptions {
  gatesList: string[];
}

export class PanelView {
  button: HTMLButtonElement | null = null;
  select: HTMLSelectElement | null = null;

  constructor(
    private root: HTMLElement,
    private options: PanelOptions,
  ) {}

  private renderButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Add Gate';
    return button;
  }

  private renderSelect() {
    const select = document.createElement('select');
    this.options.gatesList.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    return select;
  }

  create() {
    this.select = this.renderSelect();
    this.button = this.renderButton();

    this.root.appendChild(this.select);
    this.root.appendChild(this.button);
  }

}