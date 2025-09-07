import { Tournament, Category, FieldDefinition, FieldType } from './types';

export const ALL_CATEGORIES: Category[] = ['1ª', '2ª', '3ª', '4ª'];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'Torneo de Verano PadelPoint',
    clubName: 'PadelPoint La Nucía',
    description: 'El torneo más esperado del verano. Grandes premios y mejor ambiente. ¡No te lo pierdas!',
    inscriptionStartDate: '2024-06-01T10:00:00',
    startDate: '2024-07-15T09:00:00',
    endDate: '2024-07-21T21:00:00',
    categories: {
      masculine: ['1ª', '2ª', '3ª'],
      feminine: ['2ª', '3ª'],
    },
    posterImage: 'https://via.placeholder.com/300x400.png?text=Torneo+Verano',
    status: 'OPEN',
  },
  {
    id: 't2',
    name: 'Open Anual Indoor Padel',
    clubName: 'Indoor Padel Club',
    description: 'Competición anual en nuestras pistas cubiertas. Categorías para todos los niveles.',
    inscriptionStartDate: '2024-08-01T10:00:00',
    startDate: '2024-09-05T09:00:00',
    endDate: '2024-09-10T21:00:00',
    categories: {
      masculine: ['1ª', '2ª', '3ª', '4ª'],
      feminine: ['1ª', '2ª', '3ª', '4ª'],
    },
    posterImage: 'https://via.placeholder.com/300x400.png?text=Open+Anual',
    status: 'OPEN',
  },
  {
    id: 't3',
    name: 'Torneo Benéfico "Una Sonrisa"',
    clubName: 'Club de Padel Solidario',
    description: 'Participa y colabora con una buena causa. Todos los beneficios irán destinados a la caridad.',
    inscriptionStartDate: '2024-09-15T10:00:00',
    startDate: '2024-10-10T09:00:00',
    endDate: '2024-10-12T21:00:00',
    categories: {
      masculine: ['2ª', '3ª'],
      feminine: ['2ª', '3ª'],
    },
    posterImage: null,
    status: 'IN_PROGRESS',
  },
];

export const TOURNAMENT_MODEL: FieldDefinition[] = [
    { name: 'id', type: FieldType.ID, description: 'Identificador único del torneo.', example: 't1-verano-2024' },
    { name: 'name', type: FieldType.TEXT, description: 'Nombre oficial del torneo.', example: 'Torneo de Verano PadelPoint' },
    { name: 'clubName', type: FieldType.TEXT, description: 'Nombre del club organizador.', example: 'PadelPoint La Nucía' },
    { name: 'description', type: FieldType.TEXT, description: 'Descripción detallada del evento.', example: 'Grandes premios y mejor ambiente...' },
    { name: 'inscriptionStartDate', type: FieldType.DATE, description: 'Fecha de inicio de las inscripciones.', example: '2024-06-01T10:00:00' },
    { name: 'startDate', type: FieldType.DATE, description: 'Fecha de inicio del torneo.', example: '2024-07-15T09:00:00' },
    { name: 'endDate', type: FieldType.DATE, description: 'Fecha de finalización del torneo.', example: '2024-07-21T21:00:00' },
    { name: 'categories', type: FieldType.OBJECT, description: 'Categorías divididas por género.', example: '{ masculine: ["1ª", "2ª"], feminine: ["3ª"] }' },
    { name: 'posterImage', type: FieldType.TEXT, description: 'URL de la imagen del cartel (opcional).', example: 'https://.../poster.png' },
    { name: 'status', type: FieldType.ENUM, description: 'Estado actual del torneo.', example: 'OPEN, CLOSED, IN_PROGRESS, FINISHED' },
];

export const PLAYER_MODEL: FieldDefinition[] = [
    { name: 'id', type: FieldType.ID, description: 'Identificador único del jugador.', example: 'p1-juan-perez' },
    { name: 'name', type: FieldType.TEXT, description: 'Nombre completo del jugador.', example: 'Juan Pérez' },
    { name: 'email', type: FieldType.TEXT, description: 'Correo electrónico de contacto.', example: 'juan.perez@email.com' },
    { name: 'phone', type: FieldType.TEXT, description: 'Teléfono de contacto (opcional).', example: '+34 600 123 456' },
];

export const REGISTRATION_MODEL: FieldDefinition[] = [
    { name: 'id', type: FieldType.ID, description: 'Identificador único de la inscripción.', example: 'reg-t1-p1p2' },
    { name: 'tournamentId', type: FieldType.RELATION, description: 'ID del torneo al que se inscribe.', example: 't1-verano-2024', relation: 'Tournament' },
    { name: 'player1', type: FieldType.RELATION, description: 'ID del primer jugador de la pareja.', example: 'p1-juan-perez', relation: 'Player' },
    { name: 'player2', type: FieldType.RELATION, description: 'ID del segundo jugador (opcional si es individual).', example: 'p2-ana-gomez', relation: 'Player' },
    { name: 'category', type: FieldType.ENUM, description: 'Categoría en la que se inscribe la pareja.', example: '2ª' },
    { name: 'gender', type: FieldType.ENUM, description: 'Género de la categoría.', example: 'masculine / feminine' },
];
