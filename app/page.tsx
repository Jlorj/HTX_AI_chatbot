"use client"

import Image from "next/image";
import { Message, useChat, } from '@ai-sdk/react';
import budget2024_logo_nobg from "./assets/budget2024_logo_nobg.png";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const Home = () => {
  const { append, status, messages, input, handleInputChange, handleSubmit } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = ( promptText ) => { 
    const message: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(message);
  }

  return (
    <div className="grid grid-rows items-center justify-items-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <section className={noMessages ? "" : "populated"}>
          {noMessages ? (
            <>
            <div className="flex flex-col items-center">
              <div className="flex flex-row items-center justify-items-center">
                  <Image
                  className="dark:invert"
                  src={budget2024_logo_nobg}
                  alt="Budget 2024 logo"
                  width={600}
                  height={320}
                  priority
                />
                <p className="text-[80px] ml-[-120px] mr-[120px]">|</p>
                <p className="text-[80px] ml-[-100px] mr-[120px]">GPT</p>
              </div>
              <p className="starter-text text-center">
                Ask me about any topics related to Singapore’s Finance Minister’s Budget 2024! 🇸🇬<br />
                Please refrain from any other questions aside from the Singapore Budget.
              </p>
              <br />
              <PromptSuggestionsRow onPromptClick={handlePrompt}/>
              </div>
            </>
          ) : (
            <>
              {messages.map((message, index) => <Bubble key={`message-${index}`} message={message} />)}
              {isLoading && <LoadingBubble/>}
            </>
          )}
        </section>
        <form onSubmit={handleSubmit} className="flex flex-row items-center gap-[8px]">
          <input className="question-box " onChange={handleInputChange} value={input} placeholder="Ask me something..."/>
          <button type="submit" className="submit-button">→</button>
        </form>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

export default Home;
