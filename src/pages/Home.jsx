import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import InputGroup from "../components/InputGroup/InputGroup";

const Home = () => {

    const { state, dispatch } = useContext(AppContext);

    const [systemMessage, setSystemMessage] = useState(state.aiParameters.systemMessage);
    const [maxTokens, setMaxTokens] = useState(state.aiParameters.maxTokens);
    const [temperature, setTemperature] = useState(state.aiParameters.temperature);
    const [topP, setTopP] = useState(state.aiParameters.topP);

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

    return (
        <div className="container mx-auto max-w-screen-lg">
            <div className="flex gap-x-4">
                <div className="w-2/3">
                    <div className="flex flex-col gap-y-4 bg-white mt-10 p-5 rounded-md shadow-sm">
                        <div>
                            <InputGroup />
                        </div>
                        <div>
                            <InputGroup
                                label="Description"
                                id="desc"
                                type="textarea"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col gap-y-4 bg-white mt-10 p-5 rounded-md shadow-sm ">
                    <div>
                        <label htmlFor="" className="text-gray-700">System message</label>
                        <div className="mt-2">
                            <textarea name="systemMessage" rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" onChange={systemMessageHandler} value={systemMessage} disabled={isDisabled}></textarea>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="" className="text-gray-700">Max tokens</label>
                        <div className="mt-2">
                            <input type="text" name="maxTokens" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={maxTokens} placeholder="Max tokens" onChange={maxTokensHandler} disabled={isDisabled} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="" className="text-gray-700">Temperature</label>
                        <div className="mt-2">
                            <input type="text" name="temperature" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={temperature} placeholder="Temperature" onChange={temperatureHandler} disabled={isDisabled} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="" className="text-gray-700">Top p</label>
                        <div className="mt-2">
                            <input type="text" name="topP" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-blue-300" value={topP} placeholder="Top P" onChange={topPHandler} disabled={isDisabled} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;