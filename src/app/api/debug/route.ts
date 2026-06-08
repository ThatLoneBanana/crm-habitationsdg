import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const debug: any = {
    supabaseUrl: supabaseUrl ? '✅ Configuré' : '❌ Manquant',
    anonKey: anonKey ? `✅ Configuré (${anonKey.substring(0, 20)}...)` : '❌ Manquant',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    supabaseConnection: 'En test...',
  };

  // Tester la connexion Supabase
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: anonKey || '',
      },
    });

    debug.supabaseConnection = response.ok ? '✅ Accessible' : `❌ ${response.status}`;
  } catch (error: any) {
    debug.supabaseConnection = `❌ ${error.message}`;
  }

  return NextResponse.json(debug);
}
