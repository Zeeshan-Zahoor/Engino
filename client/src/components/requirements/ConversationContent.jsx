
function ConversationContent({ conversation, conversationLoading }) {
  return (
    <div className="space-y-4 p-6 max-h-100 overflow-auto scrollbar-thin scrollbar-thumb-surface">
        {conversationLoading ? (
            <div className="flex min-h-[300px] items-center justify-center ">
                <p className="text-sm text-text-secondary">
                    Loading conversation...
                </p>
            </div>
        ) : conversation?.messages?.length > 0 ? (
            <>
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                        AI Conversation
                    </h3>

                    <p className="mt-1 text-xs text-text-secondary">
                        Requirement analysis and clarification history.
                    </p>
                </div>

                <div className="space-y-4">
                    {conversation.messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[90%] rounded-xl px-4 py-3 ${
                                    message.role === "user"
                                        ? "bg-primary text-white"
                                        : "bg-surface text-text-primary"
                                }`}
                            >
                                <p
                                    className={`mb-1 text-[10px] font-semibold uppercase ${
                                        message.role === "user"
                                            ? "text-white/70"
                                            : "text-text-secondary"
                                    }`}
                                >
                                    {message.role === "user"
                                        ? "You"
                                        : "AI Assistant"}
                                </p>

                                <p className="whitespace-pre-wrap text-sm leading-5">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
                <div className="text-center">
                    <h3 className="text-sm font-semibold text-text-primary">
                        No AI Conversation
                    </h3>

                    <p className="mt-1 text-xs text-text-secondary">
                        AI analysis has not started for this requirement yet.
                    </p>
                </div>
            </div>
        )}
    </div>
  )
}

export default ConversationContent