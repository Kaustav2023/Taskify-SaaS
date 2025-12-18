import { motion } from 'framer-motion';

const TasksProgress = ({ tasks }) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    // Generate sample data for the chart
    const chartData = [
        { day: 'M', value: 3 },
        { day: 'T', value: 4 },
        { day: 'W', value: 2 },
        { day: 'T', value: 5 },
        { day: 'F', value: 3 },
        { day: 'S', value: 1 },
        { day: 'S', value: 0 },
    ];

    const maxValue = Math.max(...chartData.map(d => d.value), 1);
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length || 1;
    const hoursSpent = Math.floor(totalTasks * 1.5);

    return (
        <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Tasks Progress</h3>
                <select className="text-sm text-gray-500 bg-transparent border-none cursor-pointer">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-32 mb-4">
                {chartData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                            className="w-full bg-purple-100 rounded-t-md relative overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / maxValue) * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-purple-400 opacity-80" />
                        </motion.div>
                        <span className="text-xs text-gray-400">{item.day}</span>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-sm text-gray-600">Time spent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{hoursSpent}h</span>
                        <span className="text-xs text-green-500 bg-green-50 px-1.5 py-0.5 rounded">120%</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-600">Tasks Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{completedTasks}</span>
                        <span className="text-xs text-green-500 bg-green-50 px-1.5 py-0.5 rounded">100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksProgress;
