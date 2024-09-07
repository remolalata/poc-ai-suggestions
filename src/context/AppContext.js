// src/context/AppContext.js
import React, { createContext, useReducer } from "react";

// Create the context
export const AppContext = createContext();

// Create a reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: !state.isLoading
      }
    case "SET_IS_ERROR":  {
      return {
        ...state,
        isError: action.payload
      }
    }
    case "SET_POPOVER":
      return {
        ...state,
        showPopover: {
          title: action.payload.title !== undefined ? action.payload.title : false,
          desc: action.payload.desc !== undefined ? action.payload.desc : false,
        }
      };
    case "SET_TITLE_VALUE":
      return {
        ...state,
        titleValue: action.payload
      }
    case "SET_DESC_VALUE":
      return {
        ...state,
        descValue: action.payload
      }
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
    case "SET_MESSAGE":
      return {
        ...state,
        message: [...state.message, ...action.payload]
      }
    case "RESET_MESSAGE":
      return {
        ...state,
        message: []
      }
    case "SET_TITLE_MESSAGE":
      return {
        ...state,
        titleMessage: [...state.titleMessage, ...action.payload]
      }
    case "RESET_TITLE_MESSAGE":
      return {
        ...state,
        titleMessage: []
      }
    case "SET_RAW_TITLE_MESSAGE":
      return {
        ...state,
        rawTitleMessage: [...state.rawTitleMessage, ...action.payload]
      }
    case "RESET_RAW_TITLE_MESSAGE":
      return {
        ...state,
        rawTitleMessage: []
      }
    case "SET_DESCRIPTION_MESSAGE":
      return {
        ...state,
        descMessage: [...state.descMessage, ...action.payload]
      }
    case "RESET_DESCRIPTION_MESSAGE":
      return {
        ...state,
        descMessage: []
      }
    case "SET_RAW_DESCRIPTION_MESSAGE":
      return {
        ...state,
        rawDescMessage: [...state.rawDescMessage, ...action.payload]
      }
    case "RESET_RAW_DESCRIPTION_MESSAGE":
      return {
        ...state,
        rawDescMessage: []
      }
    case "SET_SUGGESTIONS":
      const { suggestionType, suggestionPart, suggestions } = action.payload;
      return {
        ...state,
        [suggestionType]: {
          ...state[suggestionType],
          [suggestionPart]: suggestions
        }
      }
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const initialState = {
    isLoading: false,
    isError: false,
    titleValue: null,
    descValue: null,
    showPopover: {
      title: false,
      desc: false
    },
    aiParameters: {
      maxTokens: 250,
      temperature: 0.7,
      topP: 1.0,
      systemMessage: "You are a creative innovator. Generate fresh, bold ideas and initiatives that challenge the norm. Focus on creativity, innovation, and exploring new possibilities. Keep suggestions imaginative and forward-thinking."
    },
    message: [],
    titleMessage: [],
    rawTitleMessage: [],
    descMessage: [],
    rawDescMessage: [],
    titleSuggestions: {
      initial: [
        "I want to get my teammates excited about innovation. Can you suggest some interesting title to describe it in 60 characters or less?"
      ],
      refinement: [
        "Rewrite this title"
      ],
      ongoing: [
        "Make it concise"
      ]
    },
    descSuggestions: {
      initial: [
        "I am pitching an idea to help drive innovation for the team. Can you suggest a paragraph to describe it in 250 characters or less?"
      ],
      refinement: [
        "Rewrite this description"
      ],
      ongoing: [
        "Make it catchy"
      ]
    }
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
