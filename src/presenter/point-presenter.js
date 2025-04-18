import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/main.js';

export default class PointPresenter {

  #eventListContainer = null;
  #point = null;
  #offers = null;
  #destination = null;
  #pointListComponent = null;
  #formEditListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ eventListContainer, onDataChange, onModeChange }) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init({ point, offers, destination }) {
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;

    const prevPointListComponent = this.#pointListComponent;
    const prevFormEditListComponent = this.#formEditListComponent;

    this.#pointListComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onRollupButtonClick: this.#handlePointRollupButtonClick,
      onFavoriteClick: this.#handleFavoriteButtonClick,
    });

    this.#formEditListComponent = new FormEditView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onFormSubmit: this.#handleFormSubmit,
      onRollupButtonClick: this.#handleRollupButtonClick,
      onDeleteButtonClick: this.#handleDeleteButtonClick,
    });

    if (prevPointListComponent === null || prevFormEditListComponent === null) {
      render(this.#pointListComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointListComponent, prevPointListComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditListComponent, prevFormEditListComponent);
    }

    remove(prevPointListComponent);
    remove(prevFormEditListComponent);
  }

  destroy() {
    remove(this.#pointListComponent);
    remove(this.#formEditListComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#formEditListComponent.reset(this.#point, this.#offers, this.#destination);
      this.#replaceFormEditToPoint();
    }
  }

  #replacePointToFormEdit() {
    replace(this.#formEditListComponent, this.#pointListComponent);
    document.addEventListener('keydown', this.#onEscapeKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormEditToPoint() {
    replace(this.#pointListComponent, this.#formEditListComponent);
    document.removeEventListener('keydown', this.#onEscapeKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #onEscapeKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#formEditListComponent.reset(this.#point, this.#offers, this.#destination);
      this.#replaceFormEditToPoint();
    }
  };

  #handlePointRollupButtonClick = () => {
    this.#replacePointToFormEdit();
  };

  #handleRollupButtonClick = () => {
    this.#formEditListComponent.reset(this.#point, this.#offers, this.#destination);
    this.#replaceFormEditToPoint();
  };

  #handleDeleteButtonClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      { ...this.#point }
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#point.dueDate, update.dueDate);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      // UpdateType.MINOR,
      update
    );
    this.#replaceFormEditToPoint();
  };

  #handleFavoriteButtonClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };
}
