import React, { memo } from "react"
import { InputTextSuggestion } from "../InputTextSuggestions"
import Avatar, { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"

import './Suggestion.css'

const Suggestion = memo(
    ({
        suggestion,
        onClick,
    }: {
        suggestion: string | InputTextSuggestion
        onClick: (suggestion: string | InputTextSuggestion) => void
    }) => {
        return typeof suggestion === "string" ? (
            <li onClick={() => onClick(suggestion)} className="inputText-suggestions__listitem" key={suggestion}>
                <a>{suggestion}</a>
            </li>
        ) : (
            <div
                className="inputText-suggestions__listitem--details"
                onClick={() => onClick(suggestion)}
                key={suggestion.id}
            >
                {!!suggestion.photoUrl && (
                    <Avatar
                        avatarIconState={AvatarIconState.none}
                        size="md"
                        src={suggestion.photoUrl}
                        state={AvatarState.Loaded}
                    />
                )}
                <div className="inputText-suggestions__listitem--details-labels">
                    <span className="inputText-suggestions__listitem--details-title">{suggestion.title}</span>
                    <span className="inputText-suggestions__listitem--details-subtitle">{suggestion.subtitle}</span>
                </div>
            </div>
        )
    }
)

export default Suggestion
