import { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import useSWR, { useSWRConfig } from 'swr';
import { taskApi } from '../lib/api';
import { onTaskUpdate, onTaskDelete } from '../lib/socket';
import type { Status, Task } from '../types';
import {
  Plus,
  Trash2,
  Calendar,
  User as UserIcon,
  Search,
  Filter,
  Layers,
  MoreVertical,
  CheckCircle,
  Clock,
  Timer
} from 'lucide-react';

import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const COLUMNS: { id: Status; title: string; color: string; icon: any }[] = [
  { id: 'ToDo', title: 'To Do', color: 'bg-indigo-500', icon: Clock },
  { id: 'InProgress', title: 'In Progress', color: 'bg-amber-500', icon: Timer },
  { id: 'Review', title: 'Review', color: 'bg-purple-500', icon: Layers },
  { id: 'Completed', title: 'Completed', color: 'bg-emerald-500', icon: CheckCircle },
];

const TaskPage = () => {
  const { user } = useAuth();
  const { data: response, isLoading } = useSWR('tasks', () => taskApi.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { mutate } = useSWRConfig();
  const tasks = response?.data || [];

  useEffect(() => {
    const unsubUpdate = onTaskUpdate(() => mutate('tasks'));
    const unsubDelete = onTaskDelete(() => mutate('tasks'));
    return () => {
      unsubUpdate();
      unsubDelete();
    };
  }, [mutate]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as Status;
    const updatedTasks = tasks.map(t => t.id === draggableId ? { ...t, status: newStatus } : t);
    mutate('tasks', { ...response, data: updatedTasks }, false);

    try {
      await taskApi.update(draggableId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
      mutate('tasks');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      await taskApi.delete(id);
      mutate('tasks');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: Status) => filteredTasks.filter(t => t.status === status);

  if (isLoading) return (
    <div className="flex gap-6 h-[70vh] flex-wrap md:flex-nowrap">
       {[1, 2, 3, 4].map(i => (
         <div key={i} className="flex-1 min-w-[280px] glass-card animate-pulse rounded-[2rem]" />
       ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-10 overflow-visible">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
               <Layers className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white font-heading tracking-tight">Project Board</h2>
          </div>
          <p className="text-gray-400 text-lg">Manage and synchronize your engineering sprints in real-time.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in board..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none"
            />
          </div>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-premium px-8 py-3.5 rounded-2xl text-white font-bold flex items-center gap-2 shadow-2xl shadow-indigo-500/20 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New Task
            </button>
          )}
        </div>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap lg:flex-nowrap gap-6 pb-12 overflow-visible">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex-1 min-w-[280px] flex flex-col gap-6">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${column.color} bg-opacity-20`}>
                    <column.icon className={`w-4 h-4 ${column.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading">{column.title}</h3>
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
                <button className="text-gray-700 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 min-h-[400px] rounded-[2.5rem] p-3 transition-all duration-300 border-2 border-dashed ${
                      snapshot.isDraggingOver ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-white/[0.01] border-white/5'
                    }`}
                  >
                    <div className="space-y-4">
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`glass-card p-5 group ${
                                snapshot.isDragging ? 'ring-2 ring-indigo-500 shadow-2xl scale-[1.03]' : 'hover:border-white/20'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md tracking-tighter ${
                                  task.priority === 'Urgent' ? 'bg-rose-500 text-white' :
                                  task.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                                  task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-500/60 hover:text-rose-400 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="text-white text-base font-bold mb-1 group-hover:text-indigo-400 transition-colors line-clamp-2">
                                {task.title}
                              </h4>
                              <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed">
                                {task.description}
                              </p>

                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                                  </div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-gray-300 text-[10px] font-bold">
                                      <Calendar className="w-3 h-3 text-gray-500" />
                                      <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                                   ID:{task.id.slice(0, 4)}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskPage;