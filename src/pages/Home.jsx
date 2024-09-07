import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import InputGroup from "../components/InputGroup/InputGroup";
import TagInput from "../components/TagInput/TagInput";

const Home = () => {

    const { state, dispatch } = useContext(AppContext);

    const [titleIsOpen, setTitleIsOpen] = useState(true);
    const [descIsOpen, setDescIsOpen] = useState(false);
    const [aiConfig, setAiConfig] = useState(false);

    const [systemMessage, setSystemMessage] = useState(state.aiParameters.systemMessage);
    const [maxTokens, setMaxTokens] = useState(state.aiParameters.maxTokens);
    const [temperature, setTemperature] = useState(state.aiParameters.temperature);
    const [topP, setTopP] = useState(state.aiParameters.topP);
    
    const [titleValue, setTitleValue] = useState("");
    const [descValue, setDescValue] = useState("");
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [descSuggestions, setDescSuggestions] = useState("");

    const isDisabled = state.showPopover.title || state.showPopover.desc;

    const systemMessageHandler = (event) => {
        const { value } = event.target;
        setSystemMessage(value);
        dispatch({ type: "SET_SYSTEM_MESSAGE", payload: value });
    }

    const maxTokensHandler = (event) => {
        const { value } = event.target;
        setMaxTokens(value);
        dispatch({ type: "SET_MAX_TOKENS", payload: value });
    }

    const temperatureHandler = (event) => {
        const { value } = event.target;
        setTemperature(value);
        dispatch({ type: "SET_TEMPERATURE", payload: value });
    }

    const topPHandler = (event) => {
        const { value } = event.target;
        setTopP(value);
        dispatch({ type: "SET_TOP_P", payload: value });
    }

    const handleTagsChange = (id, newTags) => {

        if (!id) return;

        const ids = id.split(".");

        dispatch({
            type: "SET_SUGGESTIONS",
            payload: {
                suggestionType: ids[0],
                suggestionPart: ids[1],
                suggestions: newTags
            }
        });
    };

    const toggleAccordion = (id) => {
        if (id === "title") {
            setTitleIsOpen(!titleIsOpen);
        }

        if (id === "desc") {
            setDescIsOpen(!descIsOpen);
        }

        if (id === "aiConfig") {
            setAiConfig(!aiConfig);
        }
    }

    const titleChangeHandler = (e) => {
        const { value } = e.target;
        setTitleValue(value);
        dispatch({ type: "SET_TITLE_VALUE", payload: value });
    }

    const descChangeHandler = (e) => {
        const { value } = e.target;
        setDescValue(value);
        dispatch({ type: "SET_DESC_VALUE", payload: value });
    }

    useEffect(() => {
        if (!titleValue.trim()) {
            setTitleSuggestions(state.titleSuggestions.initial);
        } else {
            setTitleSuggestions(state.titleSuggestions.refinement);
        }
    }, [titleValue, titleSuggestions, state.titleSuggestions.initial, state.titleSuggestions.refinement]);

    useEffect(() => {
        if (state.titleMessage.length) {
            setTitleSuggestions(state.titleSuggestions.ongoing);
        }
    }, [state.titleMessage, titleSuggestions, state.titleSuggestions]);

    useEffect(() => {
        if (!descValue.trim()) {
            setDescSuggestions(state.descSuggestions.initial);
        } else {
            setDescSuggestions(state.descSuggestions.refinement);
        }
    }, [descValue, descSuggestions,state.descSuggestions.initial, state.descSuggestions.refinement]);

    useEffect(() => {
        if (state.descMessage.length) {
            setDescSuggestions(state.descSuggestions.ongoing);
        }
    }, [state.descMessage, descSuggestions, state.descSuggestions.ongoing]);

    return (
        <div className="container mx-auto max-w-screen-lg pb-40">
            <div className="flex gap-x-4">
                <div className="w-1/2">
                    <div className="flex flex-col gap-y-4 bg-white mt-10 p-5 rounded-md shadow-sm">
                        <div>
                            <InputGroup 
                                value={titleValue} 
                                onChange={titleChangeHandler}
                                suggestions={titleSuggestions}
                                setValue={setTitleValue}
                            />
                        </div>
                        <div>
                            <InputGroup
                                label="Description"
                                id="desc"
                                type="textarea"
                                value={descValue}
                                onChange={descChangeHandler}
                                suggestions={descSuggestions}
                                setValue={setDescValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/2 flex flex-col gap-y-4">
                    <div className="bg-white p-5 rounded-md shadow-sm mt-10">
                        <div className="cursor-pointer flex justify-between items-center" onClick={() => toggleAccordion("title")}>
                            <div className="font-bold text-gray-700">Suggested Titles</div>
                            <div>{titleIsOpen ? '-' : '+'}</div>
                        </div>

                        {titleIsOpen && (
                            <div className="flex flex-col gap-y-4 mt-4">
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <div className="text-gray-700 text-sm mb-2">Initial suggestion</div>
                                        <TagInput initialTags={state.titleSuggestions.initial} id="titleSuggestions.initial" onTagsChange={handleTagsChange} />
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-gray-700 text-sm mb-2">Refinement suggestion</div>
                                        <TagInput initialTags={state.titleSuggestions.refinement} id="titleSuggestions.refinement" onTagsChange={handleTagsChange} />
                                    </div>

                                    <div>
                                        <div className="text-gray-700 text-sm mb-2">Ongoing suggestion</div>
                                        <TagInput initialTags={state.titleSuggestions.ongoing} id="titleSuggestions.ongoing" onTagsChange={handleTagsChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-5 rounded-md shadow-sm mt-2">
                        <div className="cursor-pointer flex justify-between items-center" onClick={() => toggleAccordion("desc")}>
                            <div className="font-bold text-gray-700">Suggested Descriptions</div>
                            <div>{descIsOpen ? '-' : '+'}</div>
                        </div>

                        {descIsOpen && (
                            <div className="flex flex-col gap-y-4 mt-4">
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <div className="text-gray-700 text-sm mb-2">Initial suggestion</div>
                                        <TagInput initialTags={state.descSuggestions.initial} id="descSuggestions.initial" onTagsChange={handleTagsChange} />
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-gray-700 text-sm mb-2">Refinement suggestion</div>
                                        <TagInput initialTags={state.descSuggestions.refinement} id="descSuggestions.refinement" onTagsChange={handleTagsChange} />
                                    </div>

                                    <div>
                                        <div className="text-gray-700 text-sm mb-2">Ongoing suggestion</div>
                                        <TagInput initialTags={state.descSuggestions.ongoing} id="descSuggestions.ongoing" onTagsChange={handleTagsChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-5 rounded-md shadow-sm mt-2">
                        <div className="cursor-pointer flex justify-between items-center" onClick={() => toggleAccordion("aiConfig")}>
                            <div className="font-bold text-gray-700">Open AI Configuration</div>
                            <div>{aiConfig ? '-' : '+'}</div>
                        </div>

                        {aiConfig && (
                            <>
                                <div className="mt-4">
                                    <label htmlFor="" className="text-gray-700 text-sm">System message</label>
                                    <div className="mt-2">
                                        <textarea name="systemMessage" rows={8} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" onChange={systemMessageHandler} value={systemMessage} disabled={isDisabled}></textarea>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="" className="text-gray-700 text-sm">Max tokens</label>
                                    <div className="mt-2">
                                        <input type="text" name="maxTokens" className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={maxTokens} placeholder="Max tokens" onChange={maxTokensHandler} disabled={isDisabled} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="" className="text-gray-700 text-sm">Temperature</label>
                                    <div className="mt-2">
                                        <input type="text" name="temperature" className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={temperature} placeholder="Temperature" onChange={temperatureHandler} disabled={isDisabled} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="" className="text-gray-700 text-sm">Top p</label>
                                    <div className="mt-2">
                                        <input type="text" name="topP" className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={topP} placeholder="Top P" onChange={topPHandler} disabled={isDisabled} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;