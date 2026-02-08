export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            books: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    color: string
                    accent_color: string
                    notes: string
                    position: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    color?: string
                    accent_color?: string
                    notes?: string
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    color?: string
                    accent_color?: string
                    notes?: string
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            pet_progress: {
                Row: {
                    id: string
                    user_id: string
                    pet_id: string
                    level: number
                    xp: number
                    tasks_completed: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    pet_id: string
                    level?: number
                    xp?: number
                    tasks_completed?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    pet_id?: string
                    level?: number
                    xp?: number
                    tasks_completed?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            cooldowns: {
                Row: {
                    id: string
                    user_id: string
                    cooldown_type: string
                    expires_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cooldown_type: string
                    expires_at: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cooldown_type?: string
                    expires_at?: string
                    created_at?: string
                }
            }
            daily_progress: {
                Row: {
                    id: string
                    user_id: string
                    timer_minutes: number
                    pages_written: number
                    reset_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    timer_minutes?: number
                    pages_written?: number
                    reset_at: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    timer_minutes?: number
                    pages_written?: number
                    reset_at?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            ai_recommendations: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string
                    icon: string
                    color: string
                    accent_color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description: string
                    icon?: string
                    color: string
                    accent_color: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string
                    icon?: string
                    color?: string
                    accent_color?: string
                    created_at?: string
                }
            }
        }
    }
}
