// app/dashboard/tasks/[slug]/page.tsx
import { getTaskById } from '@/app/actions/getTasks';
import { SiteHeader } from '@/components/site-header';
import TaskDetailEditor from '@/components/task-detail-editor';
import { notFound } from 'next/navigation';

interface TaskPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function TaskSlugPage({ params }: TaskPageProps) {
    const { slug } = await params;
    const taskID = slug.split("-").pop();
    
    const result = await getTaskById(taskID);

    if (result.error) {
        return (
            <div className='container mx-auto px-4 py-6'>
                <SiteHeader />
                <div className="max-w-3xl mx-auto mt-8">
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        Error: {result.error}
                    </div>
                </div>
            </div>
        );
    }

    if (!result.data) {
        notFound();
    }

    return (
        <div className='container mx-auto py-6'>
            <SiteHeader />
            <div className="mt-4">
                <TaskDetailEditor task={result.data} />
            </div>
        </div>
    );
}