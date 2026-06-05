'use server';

import { createClient } from './supabase/server';
import { prisma } from './prisma';

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Récupérer l'utilisateur depuis Prisma avec ses infos de rôle
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email || '' },
    });

    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      nom: dbUser.nom,
      prenom: dbUser.prenom,
      role: dbUser.role,
      actif: dbUser.actif,
      supabaseId: user.id,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
}
