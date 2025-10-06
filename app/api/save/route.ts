import { NextResponse } from 'next/server';
import { indexFiles } from '@/services/ai/retriever';
import type { FileItem } from '@/types';

export async function POST(req: Request) {
  try {
    const { file, files, sessionId } = await req.json() as { 
      file?: FileItem;
      files?: FileItem[];
      sessionId?: string;
    };
    
    const sid = sessionId || 'default';
    
    const filesToIndex = file ? [file] : (files || []);
    
    if (filesToIndex.length === 0) {
      return NextResponse.json({ 
        error: 'file or files array is required' 
      }, { status: 400 });
    }

    await indexFiles(filesToIndex, sid);

    return NextResponse.json({ 
      success: true,
      message: `Indexed ${filesToIndex.length} file(s) for session ${sid}`
    });
  } catch (err: any) {
    console.error('Save API error:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal error',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}