import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db, pool } from './db.js';
import { demoUsers } from './schema.js';

async function runCrudDemo() {
  let insertedUserId;

  try {
    console.log('Performing CRUD operations...');

    const [newUser] = await db
      .insert(demoUsers)
      .values({
        name: 'Admin User',
        email: `admin-${randomUUID()}@example.com`,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user.');
    }

    insertedUserId = newUser.id;
    console.log('CREATE:', newUser);

    const [foundUser] = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, newUser.id))
      .limit(1);

    if (!foundUser) {
      throw new Error('Failed to find the created user.');
    }

    console.log('READ:', foundUser);

    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name: 'Super Admin' })
      .where(eq(demoUsers.id, newUser.id))
      .returning();

    if (!updatedUser) {
      throw new Error('Failed to update user.');
    }

    console.log('UPDATE:', updatedUser);

    const [deletedUser] = await db
      .delete(demoUsers)
      .where(eq(demoUsers.id, newUser.id))
      .returning({ id: demoUsers.id });

    if (!deletedUser) {
      throw new Error('Failed to delete user.');
    }

    insertedUserId = undefined;
    console.log('DELETE: User deleted.');
    console.log('CRUD operations completed successfully.');
  } finally {
    try {
      if (insertedUserId !== undefined) {
        await db.delete(demoUsers).where(eq(demoUsers.id, insertedUserId));
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
