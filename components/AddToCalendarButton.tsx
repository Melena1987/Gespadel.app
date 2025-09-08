import React from 'react';
import type { Tournament } from '../types';
import { GoogleIcon } from './icons/GoogleIcon';

interface AddToCalendarButtonProps {
  tournament: Tournament;
  className?: string;
}

const formatGCalDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().replace(/[-:.]/g, "").slice(0, -4) + 'Z';
};

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({ tournament, className }) => {
  const handleAddToCalendar = () => {
    const startDate = formatGCalDate(tournament.startDate);
    const endDate = formatGCalDate(tournament.endDate);

    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', `Torneo: ${tournament.name}`);
    url.searchParams.append('dates', `${startDate}/${endDate}`);
    url.searchParams.append('details', `${tournament.description}\n\nClub: ${tournament.clubName}\nContacto: ${tournament.contactPhone} / ${tournament.contactEmail}`);
    url.searchParams.append('location', tournament.clubName);

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleAddToCalendar}
      className={`flex-shrink-0 flex items-center justify-center p-2.5 bg-slate-700/50 text-slate-300 rounded-lg shadow-sm hover:bg-slate-700 transition-all border border-slate-600 hover:border-slate-500 ${className}`}
      aria-label="Añadir al calendario de Google"
      title="Añadir al calendario de Google"
    >
      <GoogleIcon className="w-5 h-5" />
    </button>
  );
};
