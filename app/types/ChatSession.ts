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
  createdBy: number
  createdAt: Date
  updatedAt: Date
}

export const EXPANDABLE_SESSION_TYPES: SessionType[] = [
  'text_assistant',
  'mermaid_assistant',
  'svg_card_assistant',
  'development_assistant',
]

export const sessionTypeOptions: { value: SessionType; label: string }[] = [
  { value: 'text_assistant', label: 'Text Assistant' },
  { value: 'mermaid_assistant', label: 'Mermaid Assistant' },
  { value: 'svg_card_assistant', label: 'SVG Card Assistant' },
  { value: 'development_assistant', label: 'Development Assistant' },
  { value: 'chatbot', label: 'Chatbot' },
]
