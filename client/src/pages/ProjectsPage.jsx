import { useEffect, useState } from 'react';
import useProjectStore from '../store/projectStore';
import { Plus, MoreVertical, Trash2, Edit } from 'lucide-react';
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
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all your workspaces and teams.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Create Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {projects.map(project => (
          <Link key={project.id} to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass project-card" style={{ 
              padding: '24px', 
              borderRadius: '24px', 
              borderTop: `4px solid ${project.color}`, 
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '600' }}>{project.name}</h3>
                {project.myRole === 'OWNER' && (
                  <button 
                    onClick={(e) => handleDelete(project.id, e)} 
                    className="delete-btn"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', minHeight: '40px', lineHeight: '1.5' }}>
                {project.description || 'No description provided.'}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
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
          justifyContent: 'center', 
          alignItems: 'flex-start', // Change from center to flex-start
          zIndex: 1000, 
          padding: '40px 20px', 
          overflowY: 'auto' // Allow scrolling if screen is too small
        }}>
          <div className="glass fade-in" style={{ 
            width: '100%', 
            maxWidth: '500px', 
            padding: '32px', 
            borderRadius: '24px',
            marginTop: '20px', // Add some space from the top
            marginBottom: '40px'
          }}>
            <h2 style={{ marginBottom: '24px' }}>New Project</h2>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Project Name</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  placeholder="e.g. Mobile App Development"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="What is this project about?"
                  rows={3}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Accent Color</label>
                <input 
                  type="color" 
                  value={newProject.color}
                  onChange={e => setNewProject({...newProject, color: e.target.value})}
                  style={{ width: '100%', height: '40px', padding: '2px', cursor: 'pointer' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: 'white' }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
