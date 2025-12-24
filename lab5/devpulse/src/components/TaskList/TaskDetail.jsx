import { useState } from 'react';
import { X, AlignLeft, CheckSquare, Plus, Type } from 'lucide-react';
import { useTaskStore } from '../../store/useStore';
import styles from './TaskDetail.module.css';

export const TaskDetail = ({ task, onClose }) => {
  const { updateTask, addSubtask, toggleSubtask } = useTaskStore();
  const [subInput, setSubInput] = useState('');

  const handleDescChange = (e) => updateTask(task.id, { description: e.target.value });

  const handleAddSub = (e) => {
    e.preventDefault();
    if (subInput.trim()) {
      addSubtask(task.id, subInput);
      setSubInput('');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20}/></button>
        
        <header className={styles.header}>
          <Type size={20} className={styles.icon} />
          <h2 className={styles.title}>{task.text}</h2>
        </header>

        <section className={styles.section}>
          <div className={styles.label}><AlignLeft size={16}/> Описание</div>
          <textarea 
            className={styles.description}
            placeholder="Добавьте подробное описание задачи..."
            value={task.description}
            onChange={handleDescChange}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.label}><CheckSquare size={16}/> Подзадачи</div>
          <div className={styles.subtaskList}>
            {task.subtasks?.map(st => (
              <div key={st.id} className={styles.subItem}>
                <input 
                  type="checkbox" 
                  checked={st.completed} 
                  onChange={() => toggleSubtask(task.id, st.id)}
                />
                <span className={st.completed ? styles.stCompleted : ''}>{st.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddSub} className={styles.subForm}>
            <input 
              value={subInput}
              onChange={e => setSubInput(e.target.value)}
              placeholder="Добавить подзадачу..."
            />
            <button type="submit"><Plus size={16}/></button>
          </form>
        </section>
      </div>
    </div>
  );
};