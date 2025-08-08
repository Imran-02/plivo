import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(`${Date.now()}-${file.name}`, Buffer.from(await file.arrayBuffer()));

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}