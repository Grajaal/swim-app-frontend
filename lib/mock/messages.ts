import { Message } from '@/app/dashboard/chat/page'

export const messages: Message[] = [
  { id: '1', role: 'user', content: 'Hello, how are you?' },
  { id: '2', role: 'assistant', content: 'I am fine, thank you!' },
  { id: '3', role: 'user', content: 'What is your name?' },
  { id: '4', role: 'assistant', content: 'I am an AI assistant.' },
  { id: '5', role: 'user', content: 'Can you help me with my homework?' },
  {
    id: '6',
    role: 'assistant',
    content: 'Sure! What do you need help with?'
  },
  { id: '7', role: 'user', content: 'I need help with math.' },
  {
    id: '8',
    role: 'assistant',
    content: 'What specific math problem do you have?'
  },
  {
    id: '9',
    role: 'user',
    content: 'I need to solve this equation: 2x + 3 = 7.'
  },
  {
    id: '10',
    role: 'assistant',
    content: 'To solve for x, subtract 3 from both sides and then divide by 2.'
  },
  { id: '11', role: 'user', content: 'So x = 2?' },
  { id: '12', role: 'assistant', content: 'Correct! x = 2.' },
  { id: '13', role: 'user', content: 'Thank you!' },
  {
    id: '14',
    role: 'assistant',
    content: "You're welcome! If you have any more questions, feel free to ask."
  },
  { id: '15', role: 'user', content: 'What is the capital of France?' },
  { id: '16', role: 'assistant', content: 'The capital of France is Paris.' },
  { id: '17', role: 'user', content: 'Can you tell me more about Paris?' }
]
