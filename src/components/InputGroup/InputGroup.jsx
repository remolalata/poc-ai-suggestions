import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { AppContext } from "../../context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

import generateChatResponse from "../../api/openaiService";

const InputGroup = ({
    label = "Title",
    id = "title",
    type = "text",
    placeholder = "",
    suggestions = [],
    onChange = null,
    value,
    setValue
}) => {
    const { state, dispatch } = useContext(AppContext);

    const [inputValue, setInputValue] = useState("");

    const popoverId = state.showPopover[id];

    const messages = (id === "title") ? state.titleMessage : state.descMessage;

    const chatboxRef = useRef(null);
    const wrapperRef = useRef(null)

    const popoverHandler = (id) => {
        if (id) {
            dispatch({ type: "SET_POPOVER", payload: { [id]: true } });
        }
    };

    const aiInputChangeHandler = (event) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const closeHandler = useCallback((id) => {
        if (id) {
            dispatch({ type: "SET_POPOVER", payload: { [id]: false } });
        }
    }, [dispatch]);

    const handleClickOutside = useCallback((event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            closeHandler(id);
        }
    }, [id, closeHandler]);

    const sendHandler = async () => {
        if (!inputValue.trim()) return;

        dispatch({ type: "SET_IS_LOADING" });
        dispatch({ type: "SET_IS_ERROR", payload: false });

        const systemMessage = { role: "system", content: state.aiParameters.systemMessage };
        const messages = (id === "title") ? state.titleMessage : state.descMessage;

        const newMessage = { role: "user", content: inputValue };

        let rawMessages = [...state.message, newMessage];
        let updatedMessages = [newMessage];

        if (messages.length === 0) {
            updatedMessages = [
                systemMessage,
                ...updatedMessages
            ];
        }

        if (state.message.length === 0) {
            rawMessages = [
                systemMessage,
                ...rawMessages
            ];
            dispatch({ type: "SET_MESSAGE", payload: [...rawMessages] });
        }

        try {
            const response = await generateChatResponse({
                messages: [...rawMessages, newMessage],
                maxTokens: state.aiParameters.maxTokens,
                temperature: state.aiParameters.temperature,
                topP: state.aiParameters.topP,
            });

            const assistantMessage = [{
                role: 'assistant',
                content: response,
            }];

            if (id === "title") {
                dispatch({ type: "SET_TITLE_MESSAGE", payload: updatedMessages });
            } else {
                dispatch({ type: "SET_DESCRIPTION_MESSAGE", payload: updatedMessages });
            }

            if (id === "title") {
                dispatch({ type: "SET_TITLE_MESSAGE", payload: assistantMessage });
            } else {
                dispatch({ type: "SET_DESCRIPTION_MESSAGE", payload: assistantMessage });
            }

            dispatch({ type: "SET_MESSAGE", payload: assistantMessage });

            setInputValue("");

        } catch (error) {
            dispatch({ type: "SET_IS_ERROR", payload: true });
        } finally {
            dispatch({ type: "SET_IS_LOADING" });
        }
    };

    const tryAgainHandler = async () => {
        dispatch({ type: "SET_IS_LOADING" });
        dispatch({ type: "SET_IS_ERROR", payload: false });

        const messages = (id === "title") ? state.titleMessage : state.descMessage;

        try {
            const response = await generateChatResponse({
                messages: messages,
                maxTokens: state.aiParameters.maxTokens,
                temperature: state.aiParameters.temperature,
                topP: state.aiParameters.topP,
            });

            const assistantMessage = [{
                role: 'assistant',
                content: response,
            }];

            if (id === "title") {
                dispatch({ type: "SET_TITLE_MESSAGE", payload: assistantMessage });
            } else {
                dispatch({ type: "SET_DESCRIPTION_MESSAGE", payload: assistantMessage });
            }
        } catch (error) {
            dispatch({ type: "SET_IS_ERROR", payload: true });
        } finally {
            dispatch({ type: "SET_IS_LOADING" });
        }
    }

    const applySuggestionHandler = (text) => {
        setValue(text);
        dispatch({ type: "SET_POPOVER", payload: { [id]: false } });
    }

    const makeSuggestionHandler = async (text) => {
        dispatch({ type: "SET_IS_LOADING" });
        dispatch({ type: "SET_IS_ERROR", payload: false });

        const systemMessage = { role: "system", content: state.aiParameters.systemMessage };
        const messages = (id === "title") ? state.titleMessage : state.descMessage;

        let newMessage = {};

        if (text.toLowerCase().includes("rewrite")) {
            newMessage = {
                role: "user",
                ...(id === "title"
                    ? {
                        content: `Rewrite this title '${state.titleValue}'. Based on this title and the following prompt from the user: '${text}', generate a related title that matches both the title and the user's request.`
                    }
                    : {
                        content: `The user has provided the title: '${state.descValue}'. Based on this title and the following prompt from the user: '${text}', generate a related description that matches both the description and the user's request.`
                    })
            }
        } else {
            newMessage = { role: "user", content: text };
        }

        let rawMessages = [...state.message, newMessage];
        let updatedMessages = [newMessage];

        if (messages.length === 0) {
            updatedMessages = [
                systemMessage,
                ...updatedMessages
            ];
        }

        if (state.message.length === 0) {
            rawMessages = [
                systemMessage,
                ...rawMessages
            ];
            dispatch({ type: "SET_MESSAGE", payload: [...rawMessages] });
        }

        try {
            const response = await generateChatResponse({
                messages: [...new Set([...rawMessages, newMessage])],
                maxTokens: state.aiParameters.maxTokens,
                temperature: state.aiParameters.temperature,
                topP: state.aiParameters.topP,
            });

            const assistantMessage = [{
                role: 'assistant',
                content: response,
            }];

            if (id === "title") {
                dispatch({ type: "SET_TITLE_MESSAGE", payload: updatedMessages });
            } else {
                dispatch({ type: "SET_DESCRIPTION_MESSAGE", payload: updatedMessages });
            }

            if (id === "title") {
                dispatch({ type: "SET_TITLE_MESSAGE", payload: assistantMessage });
            } else {
                dispatch({ type: "SET_DESCRIPTION_MESSAGE", payload: assistantMessage });
            }

            dispatch({ type: "SET_MESSAGE", payload: assistantMessage });
        } catch (error) {
            dispatch({ type: "SET_IS_ERROR", payload: true });
        } finally {
            dispatch({ type: "SET_IS_LOADING" });
        }
    }

    useEffect(() => {
        if (popoverId) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverId, handleClickOutside]);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [state.titleMessage, state.descMessage, state.isLoading]);

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-3">
                <label htmlFor={label.toLowerCase()} className="text-gray-700">{label}</label>
                <div className="relative">
                    <button onClick={() => popoverHandler(id)}>
                        <FontAwesomeIcon icon={faRobot} className="text-gray-700 text-xs mr-1" />
                        <span className="border-b border-gray-700 text-xs">AI Editor</span>
                    </button>
                    {popoverId &&
                        <div ref={wrapperRef} className="absolute z-50 top-0 left-full ml-2 w-[600px] bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="p-4 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Chatbox</h2>
                                    <button onClick={() => closeHandler(id)} className="text-gray-500 hover:text-gray-800">
                                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                                    </button>
                                </div>
                                <div ref={chatboxRef} className="chatbox">
                                    {messages.slice(1).map((msg, index) => (
                                        <p key={index} className="text-sm text-gray-700 flex items-start gap-x-1">
                                            <strong>{msg.role === "user" ? "You:" : "AI:"} </strong>
                                            <span>{msg.content}</span>
                                            {msg.role === "assistant" && (
                                                <button key={index} type="button" onClick={() => applySuggestionHandler(msg.content)}><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" /></button>
                                            )}
                                        </p>
                                    ))}
                                    {state.isLoading && (
                                        <div className="flex items-center justify-center mt-4">
                                            <svg
                                                className="animate-spin h-5 w-5 text-blue-500 mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                ></path>
                                            </svg>
                                            <span className="text-sm text-gray-500">Loading...</span>
                                        </div>
                                    )}
                                    {state.isError && (
                                        <div className="text-red-500 text-sm mt-2">Connection limit reached. Please try again in 5-10 seconds.</div>
                                    )}
                                </div>
                                <div className="mt-5">
                                    {suggestions.length ?
                                        <div className="mb-3">
                                            <p className="text-sm text-gray-500 italic mb-2">Use one of these prompts, or type your own below.</p>
                                            {suggestions.map((suggestion, index) =>
                                                <button 
                                                    key={index} 
                                                    type="button" 
                                                    className="mr-1 mb-1 text-left bg-gray-200 text-gray-800 p-1 rounded text-sm font-semibold"
                                                    onClick={() => makeSuggestionHandler(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            )}
                                        </div>
                                        : null
                                    }
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        onChange={aiInputChangeHandler}
                                        value={inputValue}
                                    />
                                    <div className="flex items-center justify-between gap-x-4 mt-2">
                                        <button
                                            type="button"
                                            className="w-1/2 px-3 py-1.5 bg-danger text-sm text-white rounded-md focus:outline-none disabled:bg-red-200"
                                            onClick={tryAgainHandler}
                                            disabled={messages.length === 0 ? true : false}
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 px-3 py-1.5 bg-primary text-sm text-white rounded-md focus:outline-none"
                                            onClick={sendHandler}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {type === "textarea"
                ? <textarea
                    id={label.toLowerCase()}
                    name={label.toLowerCase()}
                    rows="8"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={popoverId}
                />
                : <input
                    type={type}
                    id={label.toLowerCase()}
                    name={label.toLowerCase()}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={popoverId}
                />
            }
        </div>
    );
};

export default InputGroup;