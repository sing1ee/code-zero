export type SessionType =
  | 'text_assistant'
  | 'mermaid_assistant'
  | 'svg_card_assistant'
  | 'development_assistant'
  | 'chatbot'

export interface ChatSession {
  id: string
  name: string
  systemPrompt: string
  type: SessionType
}

export const EXPANDABLE_SESSION_TYPES: SessionType[] = [
  'text_assistant',
  'mermaid_assistant',
  'svg_card_assistant',
  'development_assistant',
]
