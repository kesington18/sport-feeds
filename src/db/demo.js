import { eq } from 'drizzle-orm';
import { db, pool } from './db.js';
import { matches } from './schema.js';

async function runCrudDemo() {
  let insertedMatchId;

  try {
    console.log('Performing CRUD operations...');

    const [newMatch] = await db
      .insert(matches)
      .values({
        sport: 'football',
        homeTeam: 'Home FC',
        awayTeam: 'Away FC',
        startTime: new Date(),
      })
      .returning();

    if (!newMatch) {
      throw new Error('Failed to create match.');
    }

    insertedMatchId = newMatch.id;
    console.log('CREATE:', newMatch);

    const [foundMatch] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, newMatch.id))
      .limit(1);

    if (!foundMatch) {
      throw new Error('Failed to find the created match.');
    }

    console.log('READ:', foundMatch);

    const [updatedMatch] = await db
      .update(matches)
      .set({ status: 'live', homeScore: 1 })
      .where(eq(matches.id, newMatch.id))
      .returning();

    if (!updatedMatch) {
      throw new Error('Failed to update match.');
    }

    console.log('UPDATE:', updatedMatch);

    const [deletedMatch] = await db
      .delete(matches)
      .where(eq(matches.id, newMatch.id))
      .returning({ id: matches.id });

    if (!deletedMatch) {
      throw new Error('Failed to delete match.');
    }

    insertedMatchId = undefined;
    console.log('DELETE: Match deleted.');
    console.log('CRUD operations completed successfully.');
  } finally {
    try {
      if (insertedMatchId !== undefined) {
        await db.delete(matches).where(eq(matches.id, insertedMatchId));
      }
    } finally {
      await pool.end();
    }
  }
}

runCrudDemo().catch((error) => {
  console.error('Error performing CRUD operations:', error);
  process.exitCode = 1;
});
 