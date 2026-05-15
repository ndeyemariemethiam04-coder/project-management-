import { useEffect, useState } from 'react';
import useProjectStore from '../store/projectStore';
import { Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const { projects, fetchProjects, createProject, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', color: '#6366f1' });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', color: '#6366f1' });
      toast.success('Project created!');
    } catch (error) {
      console.error('Project creation failed:', error);
      const message = error.response?.data?.error || 'Failed to create project';
      toast.error(message);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted');
      } catch (error) {
        console.error('Project deletion failed:', error);
        const message = error.response?.data?.error || 'Failed to delete project';
        toast.error(message);
      }
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '700' }}>My Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage all your workspaces and teams.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            padding: '12px 28px', 
            background: 'var(--primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          <Plus size={20} /> Create Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
        {projects.map(project => (
          <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass" style={{ 
              padding: '30px', 
              borderRadius: '24px', 
              borderTop: `6px solid ${project.color}`, 
              position: 'relative',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700' }}>{project.name}</h3>
                  {project.myRole === 'OWNER' && (
                    <button 
                      onClick={(e) => handleDelete(project.id, e)} 
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        color: '#ef4444', 
                        padding: '8px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px', lineHeight: '1.6' }}>
                  {project.description || 'Create a full stack project management.'}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {project.columns?.reduce((acc, c) => acc + (c.tasks?.length || 0), 0) || 0} Tasks
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.85)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 9999, 
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '550px', padding: '40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '700' }}>New Project</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Fill in the details to start your new workspace.</p>
            
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.95rem' }}>Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Web Development"
                  required
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.95rem' }}>Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="What are you building?"
                  rows={4}
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.95rem' }}>Accent Color</label>
                <input 
                  type="color" 
                  value={newProject.color}
                  onChange={e => setNewProject({...newProject, color: e.target.value})}
                  style={{ width: '100%', height: '50px', padding: '4px', cursor: 'pointer', borderRadius: '14px', border: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: '600' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '14px', borderRadius: '14px', background: 'var(--primary)', color: 'white', fontWeight: '700' }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
