// Fix: Create file content for constants.ts
import { FieldType, type Category, type FieldDefinition } from './types';

export const ALL_CATEGORIES: Category[] = ['1ª', '2ª', '3ª', '4ª', '5ª'];

export const TOURNAMENT_MODEL: FieldDefinition[] = [
  { name: 'id', type: FieldType.ID, description: 'Identificador único del torneo.', example: 't1' },
  { name: 'name', type: FieldType.TEXT, description: 'Nombre oficial del torneo.', example: 'Torneo Anual Padel Pro' },
  { name: 'clubName', type: FieldType.TEXT, description: 'Club donde se celebra el torneo.', example: 'Padel Indoor Center' },
  { name: 'startDate', type: FieldType.DATE, description: 'Fecha y hora de inicio del torneo.', example: '2024-08-15T09:00:00' },
  { name: 'endDate', type: FieldType.DATE, description: 'Fecha y hora de finalización.', example: '2024-08-18T20:00:00' },
  { name: 'contactPhone', type: FieldType.TEXT, description: 'Teléfono de contacto para el torneo.', example: '+34 600 11 22 33' },
  { name: 'contactEmail', type: FieldType.TEXT, description: 'Email de contacto para el torneo.', example: 'torneo@club.com' },
  { name: 'categories', type: FieldType.OBJECT, description: 'Categorías divididas por género.', example: '{ masculine: ["1ª"], feminine: ["2ª"] }' },
  { name: 'status', type: FieldType.ENUM, description: 'Estado actual del torneo.', example: 'OPEN, IN_PROGRESS, FINISHED' },
];

export const PLAYER_MODEL: FieldDefinition[] = [
  { name: 'id', type: FieldType.ID, description: 'Identificador único del jugador.', example: 'p123' },
  { name: 'name', type: FieldType.TEXT, description: 'Nombre completo del jugador.', example: 'Juan Pérez' },
  { name: 'email', type: FieldType.TEXT, description: 'Correo electrónico de contacto.', example: 'juan.perez@email.com' },
  { name: 'phone', type: FieldType.TEXT, description: 'Número de teléfono (opcional).', example: '+34 600 123 456' },
  { name: 'level', type: FieldType.ENUM, description: 'Nivel estimado del jugador.', example: '3ª, 4ª' },
];

export const REGISTRATION_MODEL: FieldDefinition[] = [
  { name: 'id', type: FieldType.ID, description: 'Identificador único de la inscripción.', example: 'r456' },
  { name: 'tournamentId', type: FieldType.RELATION, relation: 'Tournament', description: 'Torneo al que se inscribe.', example: 't1' },
  { name: 'player1Id', type: FieldType.RELATION, relation: 'Player', description: 'Primer jugador de la pareja.', example: 'p123' },
  { name: 'player2Id', type: FieldType.RELATION, relation: 'Player', description: 'Segundo jugador (opcional).', example: 'p124' },
  { name: 'category', type: FieldType.ENUM, description: 'Categoría en la que compiten.', example: '3ª' },
  { name: 'registrationDate', type: FieldType.DATE, description: 'Fecha de la inscripción.', example: '2024-07-20T10:30:00' },
];