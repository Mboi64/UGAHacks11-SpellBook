import { supabase } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type PetProgress = Database['public']['Tables']['pet_progress']['Row'];
type PetProgressInsert = Database['public']['Tables']['pet_progress']['Insert'];

// ============ BOOKS ============

export async function getBooks(userId: string): Promise<Book[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching books:', error);
        return [];
    }
    return data || [];
}

export async function saveBook(userId: string, book: {
    id?: string;
    title: string;
    color: string;
    accentColor: string;
    notes?: string;
    position?: number;
}): Promise<Book | null> {
    if (!supabase) return null;

    const bookData: BookInsert = {
        id: book.id,
        user_id: userId,
        title: book.title,
        color: book.color,
        accent_color: book.accentColor,
        notes: book.notes || '',
        position: book.position ?? 0,
    };

    const { data, error } = await supabase
        .from('books')
        .upsert(bookData)
        .select()
        .single();

    if (error) {
        console.error('Error saving book:', error);
        return null;
    }
    return data;
}

export async function deleteBook(bookId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

    if (error) {
        console.error('Error deleting book:', error);
        return false;
    }
    return true;
}

export async function reorderBooks(userId: string, books: { id: string; position: number }[]): Promise<boolean> {
    if (!supabase) return false;

    const updates = books.map(book =>
        supabase
            .from('books')
            .update({ position: book.position })
            .eq('id', book.id)
            .eq('user_id', userId)
    );

    try {
        await Promise.all(updates);
        return true;
    } catch (error) {
        console.error('Error reordering books:', error);
        return false;
    }
}

// ============ PET PROGRESS ============

export async function getPetProgress(userId: string): Promise<PetProgress | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('pet_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching pet progress:', error);
    }
    return data || null;
}

export async function savePetProgress(userId: string, progress: {
    petId: string;
    level: number;
    xp: number;
    tasksCompleted: number;
}): Promise<PetProgress | null> {
    if (!supabase) return null;

    const progressData: PetProgressInsert = {
        user_id: userId,
        pet_id: progress.petId,
        level: progress.level,
        xp: progress.xp,
        tasks_completed: progress.tasksCompleted,
    };

    const { data, error } = await supabase
        .from('pet_progress')
        .upsert(progressData, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) {
        console.error('Error saving pet progress:', error);
        return null;
    }
    return data;
}

// ============ COOLDOWNS ============

export async function getCooldown(userId: string, cooldownType: string): Promise<Date | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('cooldowns')
        .select('expires_at')
        .eq('user_id', userId)
        .eq('cooldown_type', cooldownType)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cooldown:', error);
    }

    if (data) {
        const expiresAt = new Date(data.expires_at);
        if (expiresAt > new Date()) {
            return expiresAt;
        }
    }
    return null;
}

export async function setCooldown(userId: string, cooldownType: string, expiresAt: Date): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('cooldowns')
        .upsert({
            user_id: userId,
            cooldown_type: cooldownType,
            expires_at: expiresAt.toISOString(),
        }, { onConflict: 'user_id,cooldown_type' });

    if (error) {
        console.error('Error setting cooldown:', error);
        return false;
    }
    return true;
}

// ============ DAILY PROGRESS ============

export async function getDailyProgress(userId: string): Promise<{ timerMinutes: number; pagesWritten: number } | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily progress:', error);
    }

    if (data) {
        // Check if we need to reset for a new day
        const resetAt = new Date(data.reset_at);
        const now = new Date();
        if (now >= resetAt) {
            // Reset for new day
            await resetDailyProgress(userId);
            return { timerMinutes: 0, pagesWritten: 0 };
        }
        return { timerMinutes: data.timer_minutes, pagesWritten: data.pages_written };
    }
    return null;
}

export async function updateDailyProgress(userId: string, updates: { timerMinutes?: number; pagesWritten?: number }): Promise<boolean> {
    if (!supabase) return false;

    // Get tomorrow at midnight for reset
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const { error } = await supabase
        .from('daily_progress')
        .upsert({
            user_id: userId,
            timer_minutes: updates.timerMinutes ?? 0,
            pages_written: updates.pagesWritten ?? 0,
            reset_at: tomorrow.toISOString(),
        }, { onConflict: 'user_id' });

    if (error) {
        console.error('Error updating daily progress:', error);
        return false;
    }
    return true;
}

async function resetDailyProgress(userId: string): Promise<void> {
    if (!supabase) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await supabase
        .from('daily_progress')
        .upsert({
            user_id: userId,
            timer_minutes: 0,
            pages_written: 0,
            reset_at: tomorrow.toISOString(),
        }, { onConflict: 'user_id' });
}
