import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function PomodoroPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef(null);

  const settings = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/pomodoro/stats');
        setSessionsCompleted(res.data.count);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          handleComplete();
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds]);

  const handleComplete = async () => {
    setIsActive(false);
    new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3').play().catch(() => {});
    
    if (mode === 'work') {
      setSessionsCompleted(prev => prev + 1);
      toast.success('Work session completed! Time for a break.');
      // Log to backend
      try {
        await api.post('/pomodoro', { duration: settings.work, completed: true });
      } catch (err) {
        console.error('Failed to log session');
      }
      setMode('shortBreak');
      setMinutes(settings.shortBreak);
    } else {
      toast.success('Break over! Back to work.');
      setMode('work');
      setMinutes(settings.work);
    }
    setSeconds(0);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(settings[mode]);
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(settings[newMode]);
    setSeconds(0);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Focus Timer</h1>
        <p style={{ color: 'var(--text-muted)' }}>Boost your productivity with the Pomodoro technique.</p>
      </div>

      <div className="glass" style={{ padding: '40px', borderRadius: '40px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '16px' }}>
          <button 
            onClick={() => switchMode('work')}
            style={{ padding: '8px 20px', background: mode === 'work' ? 'var(--primary)' : 'transparent', color: mode === 'work' ? 'white' : 'var(--text-muted)' }}
          >
            Work
          </button>
          <button 
            onClick={() => switchMode('shortBreak')}
            style={{ padding: '8px 20px', background: mode === 'shortBreak' ? 'var(--primary)' : 'transparent', color: mode === 'shortBreak' ? 'white' : 'var(--text-muted)' }}
          >
            Short Break
          </button>
          <button 
            onClick={() => switchMode('longBreak')}
            style={{ padding: '8px 20px', background: mode === 'longBreak' ? 'var(--primary)' : 'transparent', color: mode === 'longBreak' ? 'white' : 'var(--text-muted)' }}
          >
            Long Break
          </button>
        </div>

        <div className="timer-circle" style={{ borderColor: mode === 'work' ? 'var(--primary)' : 'var(--success)' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
          <button 
            onClick={toggleTimer}
            style={{ width: '80px', height: '80px', borderRadius: '50%', background: isActive ? 'var(--bg-sidebar)' : 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
          </button>
          <button 
            onClick={resetTimer}
            style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RotateCcw size={32} />
          </button>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
          <Brain size={20} />
          <span>Sessions today: <strong>{sessionsCompleted}</strong></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%', maxWidth: '800px' }}>
        <div className="glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
          <Coffee size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h4>Stay Hydrated</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drink water during your short breaks.</p>
        </div>
        <div className="glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
          <Bell size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h4>Sound Alert</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>We'll notify you when the timer is up.</p>
        </div>
      </div>
    </div>
  );
}
