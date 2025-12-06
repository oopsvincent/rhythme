"use client"
import { Status, Task, Priority } from '@/types/database';
import { useRouter } from 'next/navigation';
import { Checkbox } from './ui/checkbox';
import { updateTaskStatus, deleteTask } from '@/app/actions/getTasks';
import { useState, useTransition } from 'react';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { generateSlug } from '@/lib/slug';

interface TaskItemProps {
    task: Task;
}

const priorityColors: Record<Priority, string> = {
    high: 'bg-red-500/90 text-white',
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
            return { text: 'Overdue', className: 'text-red-400' };
        } else if (diffDays === 0) {
            return { text: 'Today', className: 'text-yellow-400' };
        } else if (diffDays === 1) {
            return { text: 'Tomorrow', className: 'text-blue-400' };
        } else {
            const formatted = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return { text: formatted, className: 'text-muted-foreground' };
        }
    };

    const dueDateInfo = formatDueDate();

    if (isDeleting) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50 opacity-50">
                <span className="text-sm text-muted-foreground">Deleting...</span>
            </div>
        );
    }

    return (
        <div 
            className={`group flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-border/40 bg-card hover:bg-accent/30 transition-all ${isCompleted ? 'opacity-60' : ''}`}
        >
            {/* Checkbox */}
            <Checkbox 
                checked={isCompleted}
                onCheckedChange={handleStatusChange}
                disabled={isPending}
                className="w-5 h-5 rounded-md shrink-0" 
            />

            {/* Content */}
            <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={handleNavigate}
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className={`font-medium truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {title}
                    </span>
                    {description && (
                        <span className="hidden md:inline text-muted-foreground text-sm truncate">
                            {description.length > 50 ? description.slice(0, 50) + '...' : description}
                        </span>
                    )}
                </div>
            </div>

            {/* Due Date - Mobile shows below, desktop inline */}
            {dueDateInfo && (
                <span className={`text-xs font-medium shrink-0 ${dueDateInfo.className}`}>
                    {dueDateInfo.text}
                </span>
            )}

            {/* Priority */}
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase shrink-0 ${priorityClass}`}>
                {(priority || 'medium').charAt(0).toUpperCase()}
            </span>

            {/* Actions */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleNavigate}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default TaskItem