import PromptSuggestionButton from "../components/PromptSuggestionButton";

const PromptSuggestionsRow = ({ onPromptClick }) => {
    const prompts = [
        "Am I eligible for the Majulah Package?",
        "What are the payouts I can expect to receive in December 2024?",
        "What are the key reasons for high inflation over the last two years?",
    ]

    return (
    <div className="prompt-suggestion-row ">
        {prompts.map((prompt, index) => 
            <PromptSuggestionButton 
                key={`suggestion-${index}`}
                suggestion={prompt}
                onClick={() => onPromptClick(prompt)}
            />)}
    </div>
    )
};

export default PromptSuggestionsRow;