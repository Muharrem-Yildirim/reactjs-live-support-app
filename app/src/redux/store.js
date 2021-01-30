import { createStore } from "redux";

const initialState = {
  isSupporter: false,
  claimedTicket: null,
  isOnline: false,
  messageBox: null, // { title: "error", message: "couldnt connect", canClose: false }
  messageHistory: [],
  tickets: [],
};

const reducer = (state = initialState, action) => {
  if (action.type === "ONLINE_STATE") {
    return {
      ...state,
      isOnline: action.payload.isOnline,
    };
  } else if (action.type === "MESSAGE_BOX") {
    return {
      ...state,
      messageBox: action.payload.messageBox,
    };
  } else if (action.type === "SET_MESSAGE_HISTORY") {
    return {
      ...state,
      messageHistory: action.payload.messageHistory,
    };
  } else if (action.type === "ADD_MESSAGE") {
    return {
      ...state,
      messageHistory: [...state.messageHistory, action.payload.message],
    };
  } else if (action.type === "SET_SUPPORTER_TICKETS") {
    return {
      ...state,
      tickets: action.payload.tickets,
    };
  } else if (action.type === "SET_CLAIMED_TICKET") {
    return {
      ...state,
      claimedTicket: action.payload.claimedTicket,
    };
  } else if (action.type === "IS_SUPPORTER") {
    return {
      ...state,
      isSupporter: action.payload.isSupporter,
    };
  }
  return state;
};

const store = createStore(reducer);

export default store;
