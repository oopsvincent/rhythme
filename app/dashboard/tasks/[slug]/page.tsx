// app/dashboard/tasks/[slug]/page.tsx
// Remove "use client" directive

import { getTaskById } from '@/app/actions/getTasks';
import { SiteHeader } from '@/components/site-header';
import { notFound } from 'next/navigation';

interface TaskPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function TaskSlugPage({ params }: TaskPageProps) {
    // Await params in Next.js 15+
    const { slug } = await params;
    
    // Fetch data directly in Server Component
    const result = await getTaskById(slug);

    // Handle errors
    if (result.error) {
        return (
            <div className='container p-2'>
                <SiteHeader />
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    Error: {result.error}
                </div>
            </div>
        );
    }

    const task = result.data;

    // If task not found, show 404
    if (!task) {
        notFound();
    }

    return (
        <div className='container p-2'>
            <SiteHeader />
            
            <div className="max-w-3xl mx-auto mt-8">
                <div className=" rounded-lg shadow-md p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {task.priority}
                            </span>
                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">Description</h2>
                            <p className="text-gray-700">{task.description}</p>
                        </div>
                    )}

                    {/* Details */}
                    <div className="border-t pt-4 space-y-2">
                        {task.due_date && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Due Date:</span>
                                <span className="font-medium">
                                    {new Date(task.due_date).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">
                                {new Date(task.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium">
                                {new Date(task.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}