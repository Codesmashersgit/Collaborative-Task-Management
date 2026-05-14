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
  Layers,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Timer,
  GripVertical,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

import CreateTaskModal from '../components/tasks/CreateTaskModal';
import ViewTaskModal from '../components/tasks/ViewTaskModal';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const COLUMNS: { id: Status; title: string; color: string; border: string; bg: string; icon: any }[] = [
  { id: 'ToDo', title: 'To Do', color: 'text-gray-600', border: 'border-gray-200', bg: 'bg-gray-50', icon: Clock },
  { id: 'InProgress', title: 'In Progress', color: 'text-indigo-600', border: 'border-indigo-100', bg: 'bg-indigo-50', icon: Timer },
  { id: 'Review', title: 'Review', color: 'text-amber-600', border: 'border-amber-100', bg: 'bg-amber-50', icon: Layers },
  { id: 'Completed', title: 'Done', color: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50', icon: CheckCircle },
];

const PRIORITY_STYLES: Record<string, string> = {
  Urgent: 'bg-rose-50 text-rose-600 border-rose-100',
  High: 'bg-amber-50 text-amber-600 border-amber-100',
  Medium: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Low: 'bg-gray-50 text-gray-600 border-gray-100',
};

const TaskPage = () => {
  const { user } = useAuth();
  const { data: response, isLoading } = useSWR('tasks', () => taskApi.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      await taskApi.delete(id);
      mutate('tasks');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: Status) => filteredTasks.filter(t => t.status === status);

  if (isLoading) return (
    <div className="flex gap-6 h-full page-container animate-pulse">
       {[1, 2, 3, 4].map(i => (
         <div key={i} className="flex-1 min-w-[300px] bg-white rounded-2xl border border-gray-100" />
       ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-8 page-container selection:bg-indigo-500/30">
      {/* Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-black font-heading">Board</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and track your team's progress</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium placeholder:text-gray-400 shadow-sm"
            />
          </div>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-premium px-6 py-2.5 rounded-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          )}
        </div>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ViewTaskModal 
        task={selectedTask} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
      />

      {/* Kanban Grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap lg:flex-nowrap gap-6 h-full items-start overflow-x-auto pb-6 custom-scrollbar">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="flex-1 min-w-[320px] max-w-[380px] flex flex-col gap-4">
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b-2 border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${column.color.replace('text-', 'bg-')}`} />
                    <h3 className="text-sm font-black text-black tracking-tight">{column.title}</h3>
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{columnTasks.length}</span>
                  </div>
                  <button className="text-gray-400 hover:text-black transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 min-h-[600px] rounded-2xl p-1 transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'bg-indigo-50/30' 
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="space-y-4">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                onClick={() => handleTaskClick(task)}
                                className={`bg-white border border-gray-200 p-5 rounded-[1.25rem] group cursor-pointer transition-all duration-200 shadow-sm ${
                                  snapshot.isDragging 
                                    ? 'shadow-2xl border-indigo-600 ring-4 ring-indigo-50 scale-[1.02]' 
                                    : 'hover:border-indigo-200 hover:shadow-md'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low}`}>
                                    {task.priority}
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div {...provided.dragHandleProps} className="p-1.5 text-gray-400 hover:text-indigo-600 cursor-grab">
                                      <GripVertical className="w-4 h-4" />
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                      <button 
                                        onClick={(e) => handleDeleteTask(task.id, e)}
                                        className="p-1.5 text-gray-400 hover:text-rose-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <h4 className="text-sm font-black text-black mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                  {task.title}
                                </h4>
                                <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6">
                                  {task.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                                      {task.assignedTo?.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>

                      {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-40 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-gray-50/50">
                           <Clock className="w-5 h-5 text-gray-300 mb-2" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No tasks active</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskPage;