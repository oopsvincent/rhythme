// app/tasks/task-list.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import TaskItem from "@/components/task-item";
import type { Task, Status } from "@/types/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchForm } from "./search-form";

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Set up real-time subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) =>
                task.task_id === payload.new.task_id
                  ? (payload.new as Task)
                  : task
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) =>
              prev.filter((task) => task.task_id !== payload.old.task_id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | "all")}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select> */}
      </div>

      {/* Task List */}
      <Tabs defaultValue="all" className="">
        <TabsList className="w-full">
          <TabsTrigger onClick={() => setFilter("all" as Status | "all")} value="all">All</TabsTrigger>
          <TabsTrigger onClick={() => setFilter("todo" as Status | "all")} value="todo">To Do</TabsTrigger>
          <TabsTrigger onClick={() => setFilter("in_progress" as Status | "all")} value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger onClick={() => setFilter("completed" as Status | "all")} value="completed">Done</TabsTrigger>
            <SearchForm className="pl-3" />
        </TabsList>
        <TabsContent value={filter}>            
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm || filter !== "all"
            ? "No tasks found"
            : "No tasks yet. Create your first task!"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.task_id} task={task} />
          ))}
        </div>
      )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
