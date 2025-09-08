// Fix: Create file content for types.ts
export enum FieldType {
  ID = 'ID',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  RELATION = 'RELATION',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  ENUM = 'ENUM',
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  description: string;
  example: string;
  relation?: string;
}

export type Category = '1ª' | '2ª' | '3ª' | '4ª' | '5ª';

export type TournamentStatus = 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'FINISHED';

export interface Tournament {
  id: string;
  name: string;
  clubName: string;
  description: string;
  inscriptionStartDate: string;
  startDate: string;
  endDate: string;
  categories: {
    masculine: Category[];
    feminine: Category[];
  };
  posterImage: string | null;
  status: TournamentStatus;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: 'masculine' | 'feminine';
  category?: Category;
  profilePicture?: string | null;
  role: 'player' | 'organizer';
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  hour: number; // e.g., 18 for 18:00
}

export interface Registration {
    id: string;
    tournamentId: string;
    player1Id: string;
    player2Id?: string;
    category: Category;
    gender: 'masculine' | 'feminine';
    registrationDate: string;
    timePreferences?: TimeSlot[];
}