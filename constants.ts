// Fix: Create file content for constants.ts
import { FieldType, type Tournament, type FieldDefinition, type Category, type Player, type Registration } from './types';

export const ALL_CATEGORIES: Category[] = ['1ª', '2ª', '3ª', '4ª', '5ª'];

export const TOURNAMENT_MODEL: FieldDefinition[] = [
  { name: 'id', type: FieldType.ID, description: 'Identificador único del torneo.', example: 't1' },
  { name: 'name', type: FieldType.TEXT, description: 'Nombre oficial del torneo.', example: 'Torneo Anual Padel Pro' },
  { name: 'clubName', type: FieldType.TEXT, description: 'Club donde se celebra el torneo.', example: 'Padel Indoor Center' },
  { name: 'startDate', type: FieldType.DATE, description: 'Fecha y hora de inicio del torneo.', example: '2024-08-15T09:00:00' },
  { name: 'endDate', type: FieldType.DATE, description: 'Fecha y hora de finalización.', example: '2024-08-18T20:00:00' },
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

export const MOCK_TOURNAMENTS: Tournament[] = [
    {
        id: 't1',
        name: 'I Torneo de Verano Padel Club',
        clubName: 'Padel Club Indoor',
        description: '¡El mejor torneo para empezar el verano! Premios para campeones y subcampeones, y welcome pack para todos.',
        inscriptionStartDate: '2024-06-01T10:00:00',
        startDate: '2024-07-12T09:00:00',
        endDate: '2024-07-14T21:00:00',
        categories: {
            masculine: ['2ª', '3ª', '4ª'],
            feminine: ['3ª', '4ª'],
        },
        posterImage: null,
        status: 'OPEN',
    },
    {
        id: 't2',
        name: 'Torneo Aniversario',
        clubName: 'Club de Tenis y Padel Sol',
        description: 'Celebra con nosotros nuestro 5º aniversario. Música, comida y el mejor pádel.',
        inscriptionStartDate: '2024-06-15T10:00:00',
        startDate: '2024-07-20T16:00:00',
        endDate: '2024-07-21T22:00:00',
        categories: {
            masculine: ['1ª', '2ª', '3ª'],
            feminine: [],
        },
        posterImage: null,
        status: 'OPEN',
    },
    {
        id: 't3',
        name: 'Liga de Invierno Express',
        clubName: 'Padel Norte',
        description: 'Torneo rápido de un solo día. ¡Demuestra quién manda en la pista!',
        inscriptionStartDate: '2024-05-20T10:00:00',
        startDate: '2024-06-22T09:00:00',
        endDate: '2024-06-22T23:00:00',
        categories: {
            masculine: ['3ª', '4ª', '5ª'],
            feminine: ['3ª', '4ª', '5ª'],
        },
        posterImage: null,
        status: 'IN_PROGRESS',
    },
     {
        id: 't4',
        name: 'Torneo Benéfico "Una Sonrisa"',
        clubName: 'Ciudad Deportiva Sur',
        description: 'Todo lo recaudado irá destinado a la asociación "Una Sonrisa". ¡Participa y colabora!',
        inscriptionStartDate: '2024-05-01T10:00:00',
        startDate: '2024-05-30T09:00:00',
        endDate: '2024-06-02T21:00:00',
        categories: {
            masculine: ['2ª', '3ª', '4ª'],
            feminine: ['3ª', '4ª'],
        },
        posterImage: null,
        status: 'FINISHED',
    },
];

export const MOCK_PLAYERS: Player[] = [
    { id: 'p1', name: 'Alex Doe', email: 'alex@example.com', phone: '611223344', gender: 'masculine', category: '3ª'},
    { id: 'p2', name: 'Ben Smith', email: 'ben@example.com', phone: '622334455', gender: 'masculine', category: '3ª' },
    { id: 'p3', name: 'Carla Garcia', email: 'carla@example.com', phone: '633445566', gender: 'feminine', category: '4ª' },
    { id: 'p4', name: 'Diana Jones', email: 'diana@example.com', phone: '644556677', gender: 'feminine', category: '4ª' },
    { id: 'p5', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '655667788', gender: 'masculine', category: '2ª' },
    { id: 'p6', name: 'Frank Miller', email: 'frank@example.com', phone: '666778899', gender: 'masculine', category: '2ª' },
    { id: 'p7', name: 'Grace Lee', email: 'grace@example.com', phone: '677889900', gender: 'feminine', category: '3ª' },
    { id: 'p8', name: 'Heidi Klum', email: 'heidi@example.com', phone: '688990011', gender: 'feminine', category: '3ª' },
    { id: 'p9', name: 'Ivan Drago', email: 'ivan@example.com', phone: '699001122', gender: 'masculine', category: '4ª' },
    { id: 'p10', name: 'Jack Reacher', email: 'jack@example.com', phone: '600112233', gender: 'masculine', category: '4ª' },
];


export const MOCK_REGISTRATIONS: Registration[] = [
    // Tournament t1
    { 
        id: 'reg1', 
        tournamentId: 't1', 
        player1Id: 'p1', 
        player2Id: 'p2', 
        category: '3ª', 
        gender: 'masculine', 
        registrationDate: '2024-06-20T11:00:00Z',
        timePreferences: [
            { date: '2024-07-12', hour: 18 },
            { date: '2024-07-12', hour: 20 },
        ] 
    },
    { id: 'reg2', tournamentId: 't1', player1Id: 'p9', player2Id: 'p10', category: '4ª', gender: 'masculine', registrationDate: '2024-06-21T12:00:00Z' },
    { id: 'reg3', tournamentId: 't1', player1Id: 'p3', player2Id: 'p4', category: '4ª', gender: 'feminine', registrationDate: '2024-06-22T13:00:00Z' },
    { id: 'reg4', tournamentId: 't1', player1Id: 'p7', player2Id: 'p8', category: '3ª', gender: 'feminine', registrationDate: '2024-06-23T14:00:00Z' },
    { id: 'reg10', tournamentId: 't1', player1Id: 'p5', category: '2ª', gender: 'masculine', registrationDate: '2024-06-25T10:00:00Z' },

    // Tournament t2
    { id: 'reg5', tournamentId: 't2', player1Id: 'p5', player2Id: 'p6', category: '2ª', gender: 'masculine', registrationDate: '2024-06-25T15:00:00Z' },
    
    // Tournament t3
    { id: 'reg6', tournamentId: 't3', player1Id: 'p1', player2Id: 'p2', category: '3ª', gender: 'masculine', registrationDate: '2024-05-25T16:00:00Z' },
    { id: 'reg7', tournamentId: 't3', player1Id: 'p9', category: '4ª', gender: 'masculine', registrationDate: '2024-05-26T17:00:00Z' },
    { id: 'reg8', tournamentId: 't3', player1Id: 'p3', player2Id: 'p4', category: '4ª', gender: 'feminine', registrationDate: '2024-05-27T18:00:00Z' },
    { id: 'reg9', tournamentId: 't3', player1Id: 'p7', category: '3ª', gender: 'feminine', registrationDate: '2024-05-28T19:00:00Z' },
];