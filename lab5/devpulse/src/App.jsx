// src/App.jsx
import styles from './App.module.css';
import { Header } from './components/Header/Header';
import { Timer } from './components/Timer/Timer';
import { TaskList } from './components/TaskList/TaskList';
import { Card } from './components/Card/Card';
import { Schedule } from './components/Schedule/Schedule';

function App() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.grid}>
        <Timer />
        <TaskList />

        <Schedule groupId={153} /> 
      </main>
    </div>
  );
}

export default App;