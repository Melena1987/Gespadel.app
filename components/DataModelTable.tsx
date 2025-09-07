import React from 'react';
import type { FieldDefinition } from '../types';
import { FieldType } from '../types';
import { KeyIcon } from './icons/KeyIcon';
import { TextIcon } from './icons/TextIcon';
import { NumberIcon } from './icons/NumberIcon';
import { ToggleIcon } from './icons/ToggleIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { RelationIcon } from './icons/RelationIcon';
import { ListIcon } from './icons/ListIcon';
import { EnumIcon } from './icons/EnumIcon';

interface DataModelTableProps {
  title: string;
  description: string;
  fields: FieldDefinition[];
}

const typeIconMap: Record<FieldType, React.ReactNode> = {
  [FieldType.ID]: <KeyIcon />,
  [FieldType.TEXT]: <TextIcon />,
  [FieldType.NUMBER]: <NumberIcon />,
  [FieldType.BOOLEAN]: <ToggleIcon />,
  [FieldType.DATE]: <CalendarIcon />,
  [FieldType.RELATION]: <RelationIcon />,
  [FieldType.ARRAY]: <ListIcon />,
  // Fix: Added missing OBJECT type to map
  [FieldType.OBJECT]: <ListIcon />,
  [FieldType.ENUM]: <EnumIcon />,
};

const typeColorMap: Record<FieldType, string> = {
    [FieldType.ID]: 'text-amber-400',
    [FieldType.TEXT]: 'text-sky-400',
    [FieldType.NUMBER]: 'text-violet-400',
    [FieldType.BOOLEAN]: 'text-rose-400',
    [FieldType.DATE]: 'text-green-400',
    [FieldType.RELATION]: 'text-orange-400',
    [FieldType.ARRAY]: 'text-indigo-400',
    // Fix: Added missing OBJECT type to map
    [FieldType.OBJECT]: 'text-indigo-400',
    [FieldType.ENUM]: 'text-pink-400',
}

export const DataModelTable: React.FC<DataModelTableProps> = ({ title, description, fields }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-white/10 h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10">
      <div className="p-6 border-b border-slate-300/10">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
      <div className="p-6 overflow-x-auto flex-grow">
        <ul className="space-y-4">
          {fields.map((field) => (
            <li key={field.name} className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
              <div className="flex-shrink-0 w-full sm:w-1/3 mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <span className={`mr-2 ${typeColorMap[field.type]}`}>
                        {typeIconMap[field.type]}
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-200">{field.name}</span>
                  </div>
                  <div className={`ml-6 text-xs font-mono ${typeColorMap[field.type]}`}>
                    {field.type}
                    {field.relation && <span className="text-slate-400"> -&gt; {field.relation}</span>}
                  </div>
              </div>
              <div className="flex-grow sm:w-2/3 text-slate-400 text-sm">
                <p>{field.description}</p>
                <p className="font-mono text-xs text-slate-500 mt-1">ej: {field.example}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
