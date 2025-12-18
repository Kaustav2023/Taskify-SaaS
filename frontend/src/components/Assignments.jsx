import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const Assignments = ({ tasks, onToggleComplete }) => {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    return (
        <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                    Assignments <span className="text-gray-400 font-normal">({totalCount})</span>
                </h3>
                <span className="text-sm text-gray-500">{completedCount}/{totalCount} completed</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No tasks yet</p>
                ) : (
                    tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${task.completed
                                    ? 'bg-gray-50 border-gray-100'
                                    : 'bg-white border-gray-100 hover:border-purple-200'
                                }`}
                        >
                            <button
                                onClick={() => onToggleComplete(task.id)}
                                className="flex-shrink-0"
                            >
                                {task.completed ? (
                                    <CheckCircle2 className="text-green-500" size={20} />
                                ) : (
                                    <Circle className="text-gray-300 hover:text-purple-400 transition-colors" size={20} />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className={`font-medium text-sm truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                                    }`}>
                                    {task.title}
                                </p>
                                <p className="text-xs text-gray-400">{task.category}</p>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <span className={`text-sm font-medium ${task.completed ? 'text-green-500' : 'text-gray-400'
                                    }`}>
                                    {task.completed ? '100' : '0'}/100
                                </span>
                                <p className="text-xs text-gray-400">
                                    {task.completed ? 'Done' : 'To Do'}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Assignments;
