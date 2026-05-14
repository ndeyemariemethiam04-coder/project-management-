import { useEffect } from 'react';
import useProjectStore from '../store/projectStore';
import { Plus, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { projects, fetchProjects, isLoading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Aggregate stats
  const stats = {
    totalProjects: projects.length,
    activeTasks: projects.reduce((acc, p) => acc + (p.columns?.filter(c => c.name !== 'Done').reduce((tacc, c) => tacc + (c.tasks?.length || 0), 0) || 0), 0),
    completedTasks: projects.reduce((acc, p) => acc + (p.columns?.filter(c => c.name === 'Done').reduce((tacc, c) => tacc + (c.tasks?.length || 0), 0) || 0), 0),
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with your projects.</p>
        </div>
        <Link to="/projects" className="glass" style={{ padding: '10px 20px', borderRadius: 'var(--radius)', textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Project
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Projects</span>
            <Clock size={20} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '2.5rem' }}>{stats.totalProjects}</h2>
        </div>
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active Tasks</span>
            <ListTodo size={20} color="var(--warning)" />
          </div>
          <h2 style={{ fontSize: '2.5rem' }}>{stats.activeTasks}</h2>
        </div>
        <div className="glass" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Completed Tasks</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <h2 style={{ fontSize: '2.5rem' }}>{stats.completedTasks}</h2>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Recent Projects</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.slice(0, 3).map(project => (
          <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass" style={{ padding: '24px', borderRadius: '24px', borderLeft: `6px solid ${project.color}` }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{project.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>{project.description || 'No description'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                  {project.columns?.reduce((acc, c) => acc + (c.tasks?.length || 0), 0) || 0} Tasks
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>View Board →</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No projects yet. Create your first one!</p>}
      </div>
    </div>
  );
}
