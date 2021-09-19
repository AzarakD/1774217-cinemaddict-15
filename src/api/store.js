export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  // setItems(key, items) {
  //   this._storage.setItem(
  //     this._storeKey,
  //     JSON.stringify(items),
  //   );
  // }

  setItem(key, value) {
    const store = this.getItems();
    const subStore = {
      [key] : {...store[key], ...value},
    };

    this._storage.setItem(
      this._storeKey,
      JSON.stringify({...store, ...subStore}),
    );
  }

  removeItem(storageKey, itemKey, itemId) {
    const store = this.getItems();

    delete store[storageKey][itemKey][itemId];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
    );
  }
}
