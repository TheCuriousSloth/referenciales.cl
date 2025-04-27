// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, CoreMessage, StreamTextResult } from 'ai';
import { db } from '@/lib/prisma';
// Importar el enum directamente desde @prisma/client (forma estándar)
import { MessageRole } from '@prisma/client';
import { auth } from '@/auth';

// Verificar que la API key existe, agregada en .env.local y en vercel project
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

// Initialize the OpenAI provider using the AI SDK
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    // --- Authentication ---
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    // --- End Authentication ---

    const { messages }: { messages: CoreMessage[] } = await req.json();

    // --- Save User Message ---
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      try {
        await db.chatMessage.create({
          data: {
            userId: userId,
            // Usar el enum importado directamente
            role: MessageRole.user,
            content: typeof lastUserMessage.content === 'string' ? lastUserMessage.content : JSON.stringify(lastUserMessage.content),
          },
        });
      } catch (dbError) {
        console.error("Error saving user message:", dbError);
      }
    }
    // --- End Save User Message ---

    // --- Check FAQs ---
    const lastMessageContent = typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : '';
    if (lastMessageContent && faqs.hasOwnProperty(lastMessageContent)) {
      try {
        await db.chatMessage.create({
          data: {
            userId: userId,
            // Usar el enum importado directamente
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

    // --- Add System Prompt ---
    const messagesWithSystemPrompt: CoreMessage[] = [
      { role: 'system', content: promptInitial },
      ...messages
    ];
    // --- End Add System Prompt ---

    // --- Use AI SDK streamText ---
    const result: StreamTextResult<never, never> = await streamText({
      model: openai('gpt-4o-mini'),
      messages: messagesWithSystemPrompt,
      onFinish: async ({ text }: { text: string }) => {
        try {
          await db.chatMessage.create({
            data: {
              userId: userId,
              // Usar el enum importado directamente
              role: MessageRole.bot,
              content: text,
            },
          });
        } catch (dbError) {
          console.error("Error saving bot message:", dbError);
        }
      },
    });
    // --- End Use AI SDK streamText ---

    return result.toDataStreamResponse();

  } catch (error) {
    // --- Error Handling ---
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// export const runtime = 'edge';
