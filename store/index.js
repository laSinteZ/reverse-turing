import Vuex from "vuex";
import { firebaseMutations, firebaseAction } from "vuexfire";

const createStore = () => {
  return new Vuex.Store({
    state: {
      messages: [],
      results: [],
      allRooms: []
    },

    mutations: {
      ...firebaseMutations
    },
    actions: {
      setMessagesRef: firebaseAction(({ bindFirebaseRef }, ref) => {
        bindFirebaseRef("messages", ref);
      }),
      setResultsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
        bindFirebaseRef("results", ref);
      }),
      setAllRoomsRef: firebaseAction(({ bindFirebaseRef }, ref) => {
        bindFirebaseRef("allRooms", ref);
      })
    }
  });
};

export default createStore;
