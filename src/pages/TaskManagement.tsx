import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, FileHeart, Puzzle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Research market trends', status: 'completed', dueDate: '2024-03-15' },
    { id: 2, name: 'Design UI/UX', status: 'in-progress', dueDate: '2024-03-22' },
    { id: 3, name: 'Develop backend API', status: 'pending', dueDate: '2024-03-29' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem = {
        id: tasks.length + 1,
        name: newTask,
        status: 'pending',
        dueDate: '2024-04-05', // Example due date
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const filteredTasks =
    selectedTab === 'all' ? tasks : tasks.filter((task) => task.status === selectedTab);

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-4">Task Management</h1>
        <p className="text-muted-foreground mb-8">
          Organize and track your tasks efficiently
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Enter task details below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Task description"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="pending">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="in-progress">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
          <TabsContent value="completed">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface Task {
  id: number;
  name: string;
  status: string;
  dueDate: string;
}

interface TaskTableProps {
  tasks: Task[];
  onStatusChange: (id: number, status: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
        <p className="text-muted-foreground">No tasks found in this category.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {task.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <select
                  value={task.status}
                  onChange={(e) =>
                    onStatusChange(task.id, e.target.value)
                  }
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {task.dueDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Add any action buttons here if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManagement;
