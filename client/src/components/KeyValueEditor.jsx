import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function KeyValueEditor({ pairs, onUpdate, onAdd, onRemove }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {pairs.map((pair, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => onUpdate(index, 'key', e.target.value)}
            className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => onUpdate(index, 'value', e.target.value)}
            className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
          />
          <button 
            onClick={() => onRemove(index)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-400 w-fit"
      >
        <Plus size={14} /> Add New
      </button>
    </div>
  );
}