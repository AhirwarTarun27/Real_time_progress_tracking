import React, { useEffect, useState } from 'react';
import type { Task } from '../types';
import useDebounce from '../hooks/useDebounce';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [localValue, setLocalValue] = useState(task.currentValue);
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    if (debouncedValue !== task.currentValue) {
      onUpdate(task.id, debouncedValue);
    }
  }, [debouncedValue, task.id, task.currentValue, onUpdate]);

  const taskPercentage = Math.min(
    (task.currentValue / task.targetValue) * 100,
    100
  );
  const hue = taskPercentage * 1.2;

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__name">{task.name}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="task-card__delete-btn"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      <div className="task-card__progress-bar">
        <div
          className="task-card__progress-fill"
          style={{
            width: `${taskPercentage}%`,
            backgroundColor: `hsl(${hue}, 70%, 50%)`,
          }}
        />
      </div>

      <div className="task-card__input-group">
        <input
          type="number"
          value={localValue}
          onChange={(e) =>
            setLocalValue(Math.max(0, parseFloat(e.target.value) || 0))
          }
          className="task-card__input"
          min="0"
          step="0.1"
        />
        <span className="task-card__divider">/</span>
        <span className="task-card__target">{task.targetValue}</span>
        <span className="task-card__unit">{task.unit}</span>
      </div>

      <div className="task-card__percentage">
        {taskPercentage.toFixed(1)}% Complete
      </div>
    </div>
  );
};

export default TaskCard;
