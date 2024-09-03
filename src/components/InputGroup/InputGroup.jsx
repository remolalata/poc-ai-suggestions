import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import generateChatResponse from "../../api/openaiService";

const InputGroup = ({
    label = "Title",
    id = "title",
    type = "text",
    placeholder = ""
}) => {
    const { state, dispatch } = useContext(AppContext);

    const [inputValue, setInputValue] = useState("");
    const [aiInputValue, setAIInputValue] = useState("");

    const [messages, setMessages] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const popoverId = state.showPopover[id];

    const popoverHandler = (id) => {
        if (id) {
            dispatch({ type: "SET_POPOVER", payload: { [id]: true } });
        }
    };

    const inputChangeHandler = (event) => {
        const { value } = event.target;
        setInputValue(value);
    }

    const aiInputChangeHandler = (event) => {
        const { value } = event.target;
        setAIInputValue(value);
    };

    const closeHandler = (id) => {
        if (id) {
            dispatch({ type: "SET_POPOVER", payload: { [id]: false } });
            setMessages([]);
        }
    };

    const sendHandler = async () => {
        if (!aiInputValue.trim()) return;

        const newMessage = { role: "user", content: aiInputValue };
        let updatedMessages = [...messages, newMessage];

        if (messages.length === 0) {
            const systemMessage = { role: "system", content: state.aiParameters.systemMessage };
            updatedMessages = [systemMessage, ...updatedMessages];
        }

        setMessages(updatedMessages);

        try {
            const response = await generateChatResponse({
                messages: updatedMessages,
                maxTokens: state.aiParameters.maxTokens,
                temperature: state.aiParameters.temperature,
                topP: state.aiParameters.topP,
            });

            const assistantMessage = {
                role: 'assistant',
                content: response,
            };

            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            setAIInputValue("");
        } catch (error) {
            console.error("Error generating chat response:", error);
        }
    };

    const tryAgainHandler = async () => {
        try {
            const response = await generateChatResponse({
                messages: messages,
                maxTokens: state.aiParameters.maxTokens,
                temperature: state.aiParameters.temperature,
                topP: state.aiParameters.topP,
            });

            const assistantMessage = {
                role: 'assistant',
                content: response,
            };

            setMessages(prevMessages => [...prevMessages, assistantMessage]);
            setAIInputValue("");
        } catch (error) {
            console.error("Error generating chat response:", error);
        }
    }

    const makeSuggestionHandler = (text) => {
        setSuggestions([]);
        setAIInputValue(text);
    }

    const applySuggestionHandler = (text) => {
        setInputValue(text);
        dispatch({ type: "SET_POPOVER", payload: { [id]: false } });
        setMessages([]);
    }

    useEffect(() => {
        if (inputValue.trim()) {
            if (id === "title") {
                setSuggestions(prevSuggestions => [...prevSuggestions, `Rewrite this title "${inputValue}" so it will resonate with business leadership`])
            } else {
                setSuggestions(prevSuggestions => [...prevSuggestions, `Rewrite this "${inputValue}" so it's clear and concise`])
            }
        }
    }, [inputValue]);

    useEffect(() => {
        const uniqueSuggestions = [...new Set(suggestions)];
        if (uniqueSuggestions.length !== suggestions.length) {
            setSuggestions(uniqueSuggestions);
        }
    }, [suggestions]);

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
                        <div className="absolute z-50 top-0 left-full ml-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">Chatbox</h2>
                                <div className="chatbox">
                                    {messages.slice(1).map((msg, index) => (
                                        <p key={index} className="text-sm text-gray-700 flex items-start gap-x-1">
                                            <strong>{msg.role === "user" ? "You:" : "AI:"} </strong>
                                            <span>{msg.content}</span>
                                            {msg.role === "assistant" && (
                                                <button key={index} type="button" onClick={() => applySuggestionHandler(msg.content)}><FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" /></button>
                                            )}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-5">
                                    {suggestions.length ?
                                        <div className="mb-3">
                                            {suggestions.map((suggestion, index) =>
                                                <button key={index} type="button" className="text-left bg-gray-200 text-gray-800 p-1 rounded text-sm font-semibold" onClick={() => makeSuggestionHandler(suggestion)}>{suggestion}</button>
                                            )}
                                        </div>
                                        : null
                                    }
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        onChange={aiInputChangeHandler}
                                        value={aiInputValue}
                                    />
                                    <button
                                        type="submit"
                                        className="mt-2 w-full px-3 py-1.5 bg-blue-500 text-sm text-white rounded-md focus:outline-none"
                                        onClick={sendHandler}
                                    >
                                        Send
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-2 w-full px-3 py-1.5 bg-red-500 text-sm text-white rounded-md focus:outline-none disabled:bg-red-200"
                                        onClick={tryAgainHandler}
                                        disabled={messages.length === 0 ? true : false}
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-2 w-full px-3 py-1.5 bg-gray-500 text-sm text-white rounded-md focus:outline-none"
                                        onClick={() => closeHandler(id)}
                                    >
                                        Close
                                    </button>
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
                    rows="4"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={inputChangeHandler}
                    disabled={popoverId}
                />
                : <input
                    type={type}
                    id={label.toLowerCase()}
                    name={label.toLowerCase()}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={inputChangeHandler}
                    disabled={popoverId}
                />
            }
        </div>
    );
};

export default InputGroup;