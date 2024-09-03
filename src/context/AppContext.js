// src/context/AppContext.js
import React, { createContext, useReducer } from "react";

// Create the context
export const AppContext = createContext();

// Create a reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_POPOVER":
      return {
        ...state,
        showPopover: {
          title: action.payload.title !== undefined ? action.payload.title : false,
          desc: action.payload.desc !== undefined ? action.payload.desc : false,
        }
      };
    case "SET_SYSTEM_MESSAGE":
      return {
        ...state,
        aiParameters: {
          ...state.aiParameters,
          systemMessage: action.payload
        }
      }
    case "SET_MAX_TOKENS":
      return {
        ...state,
        aiParameters: {
          ...state.aiParameters,
          maxTokens: action.payload
        }
      }
    case "SET_TEMPERATURE":
      return {
        ...state,
        aiParameters: {
          ...state.aiParameters,
          temperature: action.payload
        }
      }
    case "SET_TOP_P":
      return {
        ...state,
        aiParameters: {
          ...state.aiParameters,
          topP: action.payload
        }
      }
    default:
      return state;
  }
};

// Create a provider component
export const AppProvider = ({ children }) => {
  const initialState = {
    showPopover: {
      title: false,
      desc: false
    },
    aiParameters: {
      maxTokens: 250,
      temperature: 0.7,
      topP: 1.0,
      systemMessage: "You are a creative innovator. Generate fresh, bold ideas and initiatives that challenge the norm. Focus on creativity, innovation, and exploring new possibilities. Keep suggestions imaginative and forward-thinking."
    }
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
