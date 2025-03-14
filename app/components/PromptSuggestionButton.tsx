const PromptSuggestionButton = ({ suggestion, onClick }) => {
    return (
        <button 
            className="prompt-suggestion-button" 
            onClick={onClick}
        >
            {suggestion}
        </button>
    );
}

export default PromptSuggestionButton;