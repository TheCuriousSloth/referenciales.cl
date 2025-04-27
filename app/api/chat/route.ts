// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, CoreMessage, StreamTextResult } from 'ai';
import { db } from '@/lib/prisma';
import { MessageRole } from '@prisma/client';
import { auth } from '@/auth';

// Verificar que la API key existe, agregada en .env.local y en vercel project
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

// Initialize the OpenAI provider using the AI SDK
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // timeout is configured differently or might not be needed directly here
});

// Interfaz para las FAQs
interface FAQs {
  [key: string]: string;
}

// Preguntas frecuentes (FAQs) y sus respuestas
const faqs: FAQs = {
  "¿De qué se trata referenciales.cl?": "Referenciales.cl es una base de datos colaborativa para peritos tasadores.",
  "¿Cómo puedo registrarme?": "Al iniciar sesión con Google te registras automáticamente en nuestra aplicación.",
  "¿Cuáles son los servicios que ofrecen?": "Ofrecemos acceso a una base de datos colaborativa, incluyendo consultas personalizadas, vista por mapa y más.",
  "¿Cuál es el correo o teléfono de contacto?": "El canal oficial de comunicación es el WhatsApp: +56 9 3176 9472."
};

// Prompt inicial para orientar al asistente
const promptInitial = `
Eres un asistente virtual para referenciales.cl. Responde a las preguntas de los usuarios de manera clara y concisa, y limita tus respuestas a temas relacionados con las tasaciones inmobiliarias. Aquí hay algunas preguntas frecuentes y sus respuestas:
${Object.entries(faqs).map(([question, answer]) => `- "${question}": "${answer}"`).join('\n')}
`;

export async function POST(req: NextRequest) {
  try {
    // --- Authentication (Keep as is) ---
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    // --- End Authentication ---

    const { messages }: { messages: CoreMessage[] } = await req.json();

    // --- Save User Message (Keep as is) ---
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      try {
        await db.chatMessage.create({
          data: {
            userId: userId,
            role: MessageRole.user, // Use enum
            content: typeof lastUserMessage.content === 'string' ? lastUserMessage.content : JSON.stringify(lastUserMessage.content), // Handle potential non-string content
          },
        });
      } catch (dbError) {
        console.error("Error saving user message:", dbError);
        // Decide if you want to proceed even if saving fails
      }
    }
    // --- End Save User Message ---

    // --- Check FAQs (Keep as is) ---
    const lastMessageContent = typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : '';
    if (lastMessageContent && faqs.hasOwnProperty(lastMessageContent)) {
      // Save bot response for FAQ
      try {
        await db.chatMessage.create({
          data: {
            userId: userId,
            role: MessageRole.bot,
            content: faqs[lastMessageContent]
          }
        });
      } catch (dbError) {
        console.error("Error saving FAQ bot message:", dbError);
      }
      return NextResponse.json({ message: faqs[lastMessageContent] });
    }
    // --- End Check FAQs ---

    // --- Add System Prompt (Keep as is) ---
    const messagesWithSystemPrompt: CoreMessage[] = [
      { role: 'system', content: promptInitial },
      ...messages
    ];
    // --- End Add System Prompt ---

    // --- Use AI SDK streamText --- 
    const result: StreamTextResult<never, never> = await streamText({
      model: openai('gpt-4o-mini'),
      messages: messagesWithSystemPrompt,
      onFinish: async ({ text }: { text: string }) => { // Type the callback param
        try {
          await db.chatMessage.create({
            data: {
              userId: userId, 
              role: MessageRole.bot,
              content: text, // Use text from the callback parameter
            },
          });
        } catch (dbError) {
          console.error("Error saving bot message:", dbError);
        }
      },
    });
    // --- End Use AI SDK streamText ---

    // Return the stream response using the AI SDK helper
    return result.toDataStreamResponse(); // Use the method suggested by the linter

  } catch (error) {
    // --- Error Handling (Keep and potentially improve) ---
    console.error('Chat API Error:', error);
    // if (error instanceof OpenAI.APIError) { ... }
    return new Response('Internal Server Error', { status: 500 });
  }
}

// export const runtime = 'edge'; // Ensure runtime is compatible if used