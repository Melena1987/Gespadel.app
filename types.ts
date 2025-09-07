export type Category = '1ª' | '2ª' | '3ª' | '4ª';

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

export interface Player {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export interface Registration {
    id: string;
    tournamentId: string;
    player1: Player;
    player2?: Player;
    category: Category;
    gender: 'masculine' | 'feminine';
}
