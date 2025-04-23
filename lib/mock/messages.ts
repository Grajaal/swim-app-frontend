import { Message } from '@/app/dashboard/chat/page'

export const messages: Message[] = [
  { id: '1', sender: 'user', content: 'Hello, how are you?' },
  { id: '2', sender: 'assistant', content: 'I am fine, thank you!' },
  { id: '3', sender: 'user', content: 'What is your name?' },
  { id: '4', sender: 'assistant', content: 'I am an AI assistant.' },
  { id: '5', sender: 'user', content: 'Can you help me with my homework?' },
  {
    id: '6',
    sender: 'assistant',
    content: 'Sure! What do you need help with?'
  },
  { id: '7', sender: 'user', content: 'I need help with math.' },
  {
    id: '8',
    sender: 'assistant',
    content: 'What specific math problem do you have?'
  },
  {
    id: '9',
    sender: 'user',
    content: 'I need to solve this equation: 2x + 3 = 7.'
  },
  {
    id: '10',
    sender: 'assistant',
    content: 'To solve for x, subtract 3 from both sides and then divide by 2.'
  },
  { id: '11', sender: 'user', content: 'So x = 2?' },
  { id: '12', sender: 'assistant', content: 'Correct! x = 2.' },
  { id: '13', sender: 'user', content: 'Thank you!' },
  {
    id: '14',
    sender: 'assistant',
    content: "You're welcome! If you have any more questions, feel free to ask."
  },
  { id: '15', sender: 'user', content: 'What is the capital of France?' },
  { id: '16', sender: 'assistant', content: 'The capital of France is Paris.' },
  { id: '17', sender: 'user', content: 'Can you tell me more about Paris?' }
]
