import { useState } from "react";

function TagInput({ id, initialTags = [], onTagsChange }) {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newTags = [...tags, inputValue.trim()];
            setTags(newTags);
            setInputValue('');
            if (onTagsChange) {
                onTagsChange(id, newTags);
            }
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        setTags(newTags);
        if (onTagsChange) {
            onTagsChange(id, newTags);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 p-1 rounded-sm flex items-start justify-between mr-2 mb-2"
                    >
                        <span>{tag}</span>
                        <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-2 text-gray-400 hover:text-gray-600 font-bold"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm focus:outline-none focus:ring-1 focus:border-blue-300"
                    placeholder="Add a prompt and press 'Enter'"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTag}
                />
            </div>
        </div>
    );
}

export default TagInput;
