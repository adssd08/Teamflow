import {eq} from 'drizzle-orm';

import {db} from '../db/index.js';
import { users } from '../db/schema.js';

type createUserRecord = {
    name: string;
    email: string;
    passwordHash: string;
}

export const createUser = async(
    input: createUserRecord
) => {
    const [user] = await db
        .insert(users)
        .values(input)
        .returning();

    return user;
}

export const findUserById = async (id: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id,id))
        .limit(1)
    
    return user;
}

export const findUserByEmail = async (email: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
    
    return user;
}