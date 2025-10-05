import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import type { FileItem } from '@/types/planweave';

// Session-based vector stores
const vectorStores = new Map<string, MemoryVectorStore>();

async function getStore(sessionId: string = 'default') {
  if (!vectorStores.has(sessionId)) {
    const store = new MemoryVectorStore(
      new GoogleGenerativeAIEmbeddings({ 
        model: 'embedding-001',
        apiKey: process.env.GOOGLE_API_KEY 
      })
    );
    vectorStores.set(sessionId, store);
  }
  return vectorStores.get(sessionId)!;
}

export async function indexFiles(files: FileItem[], sessionId: string = 'default') {
  if (!files || files.length === 0) {
    console.log('No files to index');
    return;
  }

  const store = await getStore(sessionId);
  
  // Clear existing documents for this session
  vectorStores.set(sessionId, new MemoryVectorStore(
    new GoogleGenerativeAIEmbeddings({ 
      model: 'embedding-001',
      apiKey: process.env.GOOGLE_API_KEY 
    })
  ));
  
  const newStore = vectorStores.get(sessionId)!;
  
  const docs = files.flatMap(file => {
    // Split content into chunks by double newlines, or by lines if content is small
    const chunks = file.content.includes('\n\n') 
      ? file.content.split('\n\n').filter(c => c.trim().length > 0)
      : [file.content];
    
    return chunks.map(chunk => ({
      pageContent: chunk.trim(),
      metadata: { 
        path: file.path,
        name: file.name,
        language: file.language 
      }
    }));
  });

  if (docs.length > 0) {
    await newStore.addDocuments(docs);
    console.log(`Indexed ${docs.length} chunks from ${files.length} files for session ${sessionId}`);
  }
}

export async function retrieveRelevant(query: string, sessionId: string = 'default', k = 5) {
  const store = await getStore(sessionId);
  try {
    const results = await store.similaritySearch(query, k);
    console.log(`Retrieved ${results.length} relevant chunks for query: ${query.substring(0, 50)}...`);
    return results;
  } catch (error) {
    console.error('Error retrieving relevant documents:', error);
    return [];
  }
}

export async function clearVectorStore(sessionId: string = 'default') {
  vectorStores.set(sessionId, new MemoryVectorStore(
    new GoogleGenerativeAIEmbeddings({ 
      model: 'embedding-001',
      apiKey: process.env.GOOGLE_API_KEY 
    })
  ));
  console.log(`Vector store cleared for session ${sessionId}`);
}

export async function getAllStoredFiles(sessionId: string = 'default') {
  const store = await getStore(sessionId);
  // Note: MemoryVectorStore doesn't expose docs directly, but we can track them separately if needed
  return [];
}