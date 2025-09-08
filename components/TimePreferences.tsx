import React from 'react';
import type { TimeSlot } from '../types';

interface TimePreferencesProps {
  startDate: string;
  endDate: string;
  selectedSlots: TimeSlot[];
  onSlotToggle: (slot: TimeSlot) => void;
}

const getDatesInRange = (start: string, end: string): Date[] => {
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);
  
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const dayLocale: Record<number, string> = {
    0: 'dom', 1: 'lun', 2: 'mar', 3: 'mié', 4: 'jue', 5: 'vie', 6: 'sáb'
};

const HOURS = [18, 19, 20, 21, 22, 23];

export const TimePreferences: React.FC<TimePreferencesProps> = ({ startDate, endDate, selectedSlots, onSlotToggle }) => {
  const dates = getDatesInRange(startDate, endDate);

  const isSlotSelected = (date: Date, hour: number) => {
    const dateString = formatDateToYYYYMMDD(date);
    return selectedSlots.some(s => s.date === dateString && s.hour === hour);
  };
  
  const handleCellClick = (date: Date, hour: number) => {
      const slot: TimeSlot = {
          date: formatDateToYYYYMMDD(date),
          hour: hour,
      };
      onSlotToggle(slot);
  };

  const slotColors = ['bg-red-600/80', 'bg-orange-500/80'];

  return (
    <div className="overflow-x-auto w-full bg-slate-900/50 p-4 rounded-lg ring-1 ring-slate-700">
      <table className="w-full border-collapse text-center table-fixed">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="sticky left-0 bg-slate-900/50 p-2 text-sm font-semibold text-slate-300 w-20 z-10"></th>
            {dates.map(date => (
              <th key={date.toISOString()} className="p-2 text-sm font-semibold text-slate-300 min-w-[100px] w-28">
                <div>{date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                <div className="font-normal text-slate-400">{dayLocale[date.getDay()]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour, hourIndex) => (
            <tr key={hour} className="border-b border-slate-800 last:border-b-0">
              <td className="sticky left-0 bg-slate-900/50 p-2 text-sm font-semibold text-slate-400 align-middle h-14 z-10">
                {hour}:00
              </td>
              {dates.map(date => {
                const selected = isSlotSelected(date, hour);
                return (
                  <td key={date.toISOString()} className="p-1 h-14">
                    <button
                      type="button"
                      onClick={() => handleCellClick(date, hour)}
                      className={`w-full h-full rounded-md text-[11px] text-white font-semibold transition-colors duration-200 ${
                        selected 
                          ? `${slotColors[hourIndex % 2]}` 
                          : 'bg-slate-700/50 hover:bg-slate-600/70'
                      }`}
                      aria-label={`Seleccionar ${hour}:00 en ${date.toLocaleDateString()}`}
                    >
                      {selected && `${hour}:00 - ${hour + 1}:00`}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
