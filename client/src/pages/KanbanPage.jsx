import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import { Plus, ChevronLeft, Settings, Users, Calendar, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KanbanPage() {
  const { id } = useParams();
  const { currentProject, fetchProject, createTask, moveTask, deleteTask } = useProjectStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM' });

  useEffect(() => {
    fetchProject(id);
  }, [id, fetchProject]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({ ...newTask, columnId: selectedColumn, projectId: id });
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM' });
      toast.success('Task added');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const onDragOver = (taskId, targetColumnId) => {
    // Simple drag move for now (click-to-move as fallback or simulated drag)
    moveTask(taskId, targetColumnId, 0);
  };

  if (!currentProject) return <div>Loading board...</div>;

  return (
    <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/projects" style={{ color: 'var(--text-muted)' }}><ChevronLeft size={24} /></Link>
          <h1 style={{ fontSize: '1.8rem' }}>{currentProject.name}</h1>
          <div style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px' }}>
            {currentProject.myRole}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
        </div>
      </div>

      <div className="kanban-board">
        {currentProject.columns.map(column => (
          <div key={column.id} className="kanban-column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: column.color }}></span>
                {column.name}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({column.tasks.length})</span>
              </h3>
              <button 
                onClick={() => { setSelectedColumn(column.id); setIsTaskModalOpen(true); }}
                style={{ background: 'transparent', color: 'var(--text-muted)' }}
              >
                <Plus size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {column.tasks.map(task => (
                <div key={task.id} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '700', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: task.priority === 'URGENT' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'HIGH' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: task.priority === 'URGENT' ? '#ef4444' : task.priority === 'HIGH' ? '#f59e0b' : '#10b981'
                    }}>
                      {task.priority}
                    </span>
                    <button onClick={() => deleteTask(task.id, column.id)} style={{ background: 'transparent', color: 'var(--danger)', padding: '0' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {task.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <Calendar size={14} />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => moveTask(task.id, currentProject.columns[currentProject.columns.findIndex(c => c.id === column.id) - 1]?.id)}
                        disabled={currentProject.columns.findIndex(c => c.id === column.id) === 0}
                        style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', opacity: currentProject.columns.findIndex(c => c.id === column.id) === 0 ? 0.3 : 1 }}
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => moveTask(task.id, currentProject.columns[currentProject.columns.findIndex(c => c.id === column.id) + 1]?.id)}
                        disabled={currentProject.columns.findIndex(c => c.id === column.id) === currentProject.columns.length - 1}
                        style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', opacity: currentProject.columns.findIndex(c => c.id === column.id) === currentProject.columns.length - 1 ? 0.3 : 1 }}
                      >
                        →
                      </button>
                    </div>
                    {task.assignee && (
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {task.assignee.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isTaskModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '32px', borderRadius: '24px' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder="What needs to be done?"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Details..."
                  rows={3}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Priority</label>
                <select 
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  style={{ width: '100%' }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsTaskModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: 'white' }}>Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
