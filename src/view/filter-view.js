import AbstractView from '../framework/view/abstract-view.js';

function isChecked(filter) {
  return filter.count === 0 ? 'disabled' : 'unchecked';
}

function getFilterTemplate(filter) {
  return `
  <div class="trip-filters__filter">
      <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${isChecked(filter)}>
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
    </div>
  `;
}

function createFilterTemplate(filters) {
  const filterItems = filters
    .map((filter) => getFilterTemplate(filter)).join('');

  return `
  <form class="trip-filters" action="#" method="get">
    ${filterItems}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
