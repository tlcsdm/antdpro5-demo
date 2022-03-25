import {WorkitemData} from "./data";
import {Effect, Reducer} from "@@/plugin-dva/connect";
import {queryWorkitems} from "./service";

export interface ModelState {
  workitems: WorkitemData[];
}

export interface ModelType {
  namespace: string;
  state: ModelState;
  effects: {
    fetchWorkitems: Effect
  };
  reducers: {
    queryWorkitems: Reducer<ModelState>;
  };
}

const Model: ModelType = {
  namespace: 'pandoraWorkspace',
  state: {
    workitems: [],
  },
  effects: {
    * fetchWorkitems({payload}, {call, put}) {
      const response = yield call(queryWorkitems, payload);
      yield put({
        type: 'queryWorkitems',
        payload: Array.isArray(response) ? response : [],
      });
    }
  },
  reducers: {
    queryWorkitems(state, action) {
      return {
        ...(state as ModelState),
        workitems: action.payload,
      };
    }
  }
};

export default Model;
