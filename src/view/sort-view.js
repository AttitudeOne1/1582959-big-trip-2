import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

function createSortTemplate(currentSortType) {
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day" data-sort-type="${SortType.DAY}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event" data-sort-type="${SortType.EVENT}">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SortType.TIME}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SortType.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer" data-sort-type="${SortType.OFFERS}">Offers</label>
    </div>
  </form>
  `;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#onSortButtonClick);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #onSortButtonClick = (evt) => {

    const sortButton = evt.target.closest('.trip-sort__btn');
    if (!sortButton) {
      return;
    }

    const inputId = sortButton.getAttribute('for');
    const input = document.getElementById(inputId);

    if (input && input.disabled) {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
