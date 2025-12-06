'use client';

import { useState, useTransition, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Priority, Status, UpdateTaskInput } from '@/types/database';
import { updateTask, deleteTask } from '@/app/actions/getTasks';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Save, 
  X, 
  Trash2, 
  ArrowLeft,
  Loader2,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DateNTimePicker } from '@/components/date-n-time-picker';

interface TaskDetailEditorProps {
  task: Task;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'text-red-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'low', label: 'Low', color: 'text-blue-500' },
];

const statusOptions: { value: Status; label: string; icon: React.ReactNode }[] = [
  { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4 text-gray-400" /> },
  { value: 'in_progress', label: 'In Progress', icon: <Loader2 className="w-4 h-4 text-purple-500" /> },
  { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
];

export default function TaskDetailEditor({ task }: TaskDetailEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  
  // State
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium');
  const [status, setStatus] = useState<Status>(task.status || 'pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? new Date(task.due_date) : undefined
  );
  
  // Track changes - compare values properly
  const hasChanges = useCallback(() => {
    const titleChanged = title !== task.title;
    const descriptionChanged = description !== (task.description || '');
    const priorityChanged = priority !== (task.priority || 'medium');
    const statusChanged = status !== (task.status || 'pending');
    
    // Compare dates properly - both null/undefined or same timestamp
    const taskDueDate = task.due_date ? new Date(task.due_date).getTime() : null;
    const currentDueDate = dueDate ? dueDate.getTime() : null;
    const dueDateChanged = taskDueDate !== currentDueDate;
    
    return titleChanged || descriptionChanged || priorityChanged || statusChanged || dueDateChanged;
  }, [title, description, priority, status, dueDate, task]);
  
  // Only update isDirty when dependencies actually change
  const isDirty = hasChanges();

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = () => {
    startTransition(async () => {
      const updates: UpdateTaskInput = {
        title,
        description: description || null,
        priority,
        status,
        due_date: dueDate?.toISOString() || null,
      };
      
      const result = await updateTask(task.task_id, updates);
      if (!result.error) {
        router.refresh();
      }
    });
  };

  const handleDiscard = () => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setStatus(task.status || 'pending');
    setDueDate(task.due_date ? new Date(task.due_date) : undefined);
    
    // Reset contenteditable
    if (titleRef.current) titleRef.current.textContent = task.title;
    if (descriptionRef.current) descriptionRef.current.textContent = task.description || '';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTask(task.task_id);
    if (!result.error) {
      router.push('/dashboard/tasks');
    } else {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Discard?')) {
        router.push('/dashboard/tasks');
      }
    } else {
      router.push('/dashboard/tasks');
    }
  };

  const currentPriority = priorityOptions.find(p => p.value === priority) || priorityOptions[1];
  const currentStatus = statusOptions.find(s => s.value === status) || statusOptions[0];

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Tasks</span>
        </Button>

        <div className="flex items-center gap-2">
          {isDirty && (
            <>
              <Button variant="ghost" size="sm" onClick={handleDiscard} disabled={isPending}>
                <X className="w-4 h-4 mr-1" />
                Discard
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                Save
              </Button>
            </>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Content - Notion Style */}
      <div className="py-8 space-y-6">
        {/* Title - Editable */}
        <h1
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setTitle(e.currentTarget.textContent || '')}
          className="text-4xl font-bold outline-none border-none focus:outline-none empty:before:content-['Untitled'] empty:before:text-muted-foreground/50 cursor-text"
          data-placeholder="Untitled"
        >
          {task.title}
        </h1>

        {/* Properties */}
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center gap-4 py-2 px-3 -mx-3 rounded-md hover:bg-accent/50 transition-colors group">
            <span className="w-24 text-sm text-muted-foreground flex items-center gap-2">
              {currentStatus.icon}
              Status
            </span>
            <Select value={status} onValueChange={(v: Status) => setStatus(v)}>
              <SelectTrigger className="w-auto border-none shadow-none h-auto p-0 hover:bg-transparent focus:ring-0 gap-1">
                <SelectValue />
                <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-4 py-2 px-3 -mx-3 rounded-md hover:bg-accent/50 transition-colors group">
            <span className="w-24 text-sm text-muted-foreground flex items-center gap-2">
              <Flag className={`w-4 h-4 ${currentPriority.color}`} />
              Priority
            </span>
            <Select value={priority} onValueChange={(v: Priority) => setPriority(v)}>
              <SelectTrigger className="w-auto border-none shadow-none h-auto p-0 hover:bg-transparent focus:ring-0 gap-1">
                <span className={currentPriority.color}>{currentPriority.label}</span>
                <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className={option.color}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-4 py-2 px-3 -mx-3 rounded-md hover:bg-accent/50 transition-colors">
            <span className="w-24 text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </span>
            <DateNTimePicker 
              value={dueDate} 
              onChange={setDueDate}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Description - Editable */}
        <div className="min-h-[200px]">
          <div
            ref={descriptionRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setDescription(e.currentTarget.textContent || '')}
            className="text-base leading-relaxed outline-none border-none focus:outline-none empty:before:content-['Add_a_description...'] empty:before:text-muted-foreground/50 cursor-text whitespace-pre-wrap"
            data-placeholder="Add a description..."
          >
            {task.description}
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-8 border-t border-border/50 text-xs text-muted-foreground space-y-1">
          <p>Created {new Date(task.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</p>
          <p>Last edited {new Date(task.updated_at).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</p>
          {task.completed_at && (
            <p>Completed {new Date(task.completed_at).toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}</p>
          )}
        </div>
      </div>
    </div>
  );
}
