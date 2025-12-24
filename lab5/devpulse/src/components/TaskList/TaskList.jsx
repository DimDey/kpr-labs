import { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Target, 
  Layers, 
  ChevronRight 
} from 'lucide-react';
import { Card } from '../Card/Card';
import { TaskDetail } from './TaskDetail'; // Импортируем модалку
import { useTaskStore } from '../../store/useStore';
import styles from './TaskList.module.css';

export const TaskList = () => {
  const [input, setInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); // Храним только ID
  
  const { tasks, addTask, toggleTask, removeTask } = useTaskStore();

  // Находим текущую редактируемую задачу в сторе по ID
  const editingTask = tasks.find(t => t.id === editingTaskId);

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTask(input);
      setInput('');
    }
  };

  // Расчет прогресса
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card 
      title={` Задачи (${completedCount}/${totalCount})`} 
      icon={CheckSquare} 
      iconColor="var(--accent-green)"
      className={styles.taskCard}
    >
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleAdd} className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <Plus size={18} className={styles.inputIcon} />
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Добавить новую задачу..."
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.addBtn} disabled={!input.trim()}>
          Добавить
        </button>
      </form>
      
      <div className={styles.list}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`${styles.item} ${task.completed ? styles.completed : ''}`}
            >
              <label className={styles.checkboxContainer}>
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)}
                />
                <span className={styles.checkmark}></span>
              </label>

              <div 
                className={styles.taskContent} 
                onClick={() => setEditingTaskId(task.id)}
              >
                <span className={styles.taskText}>{task.text}</span>
                
                <div className={styles.badges}>
                  {task.description && <Layers size={12} title="Есть описание" />}
                  {task.subtasks?.length > 0 && (
                    <div className={styles.subBadge}>
                      <CheckSquare size={10} />
                      {task.subtasks?.filter(s => s.completed).length}/{task.subtasks?.length}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); removeTask(task.id); }} 
                className={styles.deleteBtn}
              >
                <Trash2 size={16} />
              </button>
              
              <ChevronRight size={14} className={styles.arrowIcon} />
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Target size={32} className={styles.emptyIcon} />
            <p>Нет активных заданий</p>
          </div>
        )}
      </div>

      {editingTask && (
        <TaskDetail 
          task={editingTask} 
          onClose={() => setEditingTaskId(null)} 
        />
      )}
    </Card>
  );
};