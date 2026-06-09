export async function logAction(
  action: string,
  entityId: string,
  description: string,
  userId?: string
) {
  try {
    await fetch('/api/application-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        entity: 'projet',
        entityId,
        description,
        userId,
      }),
    });
  } catch (error) {
    console.error('Erreur lors du log:', error);
  }
}
