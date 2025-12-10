"use client"
import { Status, Task, Priority } from '@/types/database';
import { useRouter } from 'next/navigation';
import { Checkbox } from './ui/checkbox';
import { updateTaskStatus, deleteTask } from '@/app/actions/getTasks';
import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { generateSlug } from '@/lib/slug';

interface TaskItemProps {
    task: Task;
}

const priorityColors: Record<Priority, string> = {
    high: 'bg-primary text-primary-foreground',
    medium: 'bg-yellow-500/90 text-white',
    low: 'bg-slate-500/80 text-white',
};

const TaskItem = ({ task }: TaskItemProps) => {
    const { title, due_date, status, task_id, description, priority } = task;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentStatus, setCurrentStatus] = useState<Status>(status || 'pending');
    const [isDeleting, setIsDeleting] = useState(false);

    const isCompleted = currentStatus === 'completed';
    const priorityClass = priority ? priorityColors[priority] : priorityColors.medium;

    const handleStatusChange = (checked: boolean | 'indeterminate') => {
        if (checked === 'indeterminate') return;
        
        const newStatus: Status = checked ? 'completed' : 'pending';
        setCurrentStatus(newStatus);
        
        startTransition(async () => {
            await updateTaskStatus(task_id, newStatus);
        });
    };

    const handleNavigate = () => {
        const slug = generateSlug(title);
        router.push(`/dashboard/tasks/${slug}-${task_id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        await deleteTask(task_id);
        router.refresh();
    };

    const formatDueDate = () => {
        if (!due_date) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'Overdue', className: 'text-red-500' };
        } else if (diffDays === 0) {
            return { text: 'Today', className: 'text-primary' };
        } else if (diffDays === 1) {
            return { text: 'Tomorrow', className: 'text-blue-500' };
        } else {
            const formatted = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return { text: formatted, className: 'text-muted-foreground' };
        }
    };

    const dueDateInfo = formatDueDate();

    if (isDeleting) {
        return (
            <div className="flex items-center justify-center p-4 opacity-50">
                <span className="text-sm text-muted-foreground">Deleting...</span>
            </div>
        );
    }

    return (
        <div 
            className={`group flex items-start gap-3 p-4 hover:bg-accent/20 transition-colors ${isCompleted ? 'opacity-60' : ''}`}
        >
            {/* Checkbox */}
            <Checkbox 
                checked={isCompleted}
                onCheckedChange={handleStatusChange}
                disabled={isPending}
                className="w-5 h-5 rounded-md shrink-0 mt-0.5 border-2" 
            />

            {/* Content */}
            <div 
                className="flex-1 min-w-0 cursor-pointer space-y-1"
                onClick={handleNavigate}
            >
                {/* Title */}
                <p className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {title}
                </p>
                
                {/* Description on new line */}
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
                
                {/* Priority Badge and Due Date */}
                <div className="flex items-center gap-2 pt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityClass}`}>
                        {(priority || 'Medium').charAt(0).toUpperCase() + (priority || 'Medium').slice(1)}
                    </span>
                    {dueDateInfo && (
                        <span className={`text-xs font-medium ${dueDateInfo.className}`}>
                            {dueDateInfo.text}
                        </span>
                    )}
                </div>
            </div>

            {/* Delete Button - Always visible on mobile, hover on desktop */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default TaskItem