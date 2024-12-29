import { Plugin } from "prosemirror-state";
 
import { EditorReduxStore } from "../../models";
import debounce from "lodash-es/debounce";
 
let id = 0;

const generateID = () => {
  id += 1;
  return id;
};

/** FSD의 widget layer가 아니라 GUI Widget을 뜻함 */
export default abstract class Widget {
  key = generateID();
  store!: typeof EditorReduxStore;

  constructor() {}

  public setStore(store: typeof EditorReduxStore) {
    this.store = store;
  }

  public abstract render(): JSX.Element;

  public plugin(): Plugin[] {
    return [];
  }

  protected debouncedDispatch = debounce((action) => {
    this.store.dispatch(action);
  }, 100);
}
