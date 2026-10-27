import React from 'react';
import { RotateCcw } from 'lucide-react';
import './UndoToast.css';

export default function UndoToast({ undoState, onUndo }) {
  if (!undoState) return null;

  return (
    <div className="undo-toast">
      <span>{undoState.message}</span>
      <button onClick={onUndo} className="undo-btn">
        <RotateCcw size={12} /> Undo ({undoState.secondsRemaining}s)
      </button>
    </div>
  );
}