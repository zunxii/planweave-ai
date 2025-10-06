import { NextRequest, NextResponse } from 'next/server';
import { indexFiles, clearVectorStore } from '@/services/ai/retriever';
import type { FileItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { action, files, sessionId } = await req.json() as { 
      action: 'sync' | 'clear'; 
      files?: FileItem[];
      sessionId?: string;
    };

    const sid = sessionId || 'default';

    if (!action) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing action' 
      }, { status: 400 });
    }

    if (action === 'clear') {
      await clearVectorStore(sid);
      return NextResponse.json({ 
        success: true, 
        message: `Vector store cleared for session ${sid}` 
      });
    }

    if (action === 'sync') {
      if (!files || !Array.isArray(files)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Files array required for syncing' 
        }, { status: 400 });
      }

      await clearVectorStore(sid);
      await indexFiles(files, sid);
      
      return NextResponse.json({ 
        success: true, 
        message: `Vector store synced with ${files.length} files for session ${sid}` 
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid action' 
    }, { status: 400 });
  } catch (err: any) {
    console.error('API sync error:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'Server error', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}