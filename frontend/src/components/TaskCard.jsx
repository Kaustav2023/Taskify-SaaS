import { motion } from 'framer-motion';

const TaskCard = ({ task, index }) => {
    const categoryColors = {
        Personal: 'purple',
        Work: 'blue',
        Learning: 'green',
        Health: 'orange',
        Ideas: 'pink',
    };

    const color = categoryColors[task.category] || 'purple';
    const progress = task.completed ? 100 : Math.floor(Math.random() * 60) + 20;
    const daysLeft = Math.floor(Math.random() * 10) + 1;

    const colorClasses = {
        purple: 'bg-purple-100 text-purple-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        pink: 'bg-pink-100 text-pink-600',
    };

    const getDaysClass = () => {
        if (daysLeft <= 3) return 'days-urgent';
        if (daysLeft <= 7) return 'days-warning';
        return 'days-normal';
    };

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 min-w-[220px] flex-shrink-0"
        >
            <p className="text-xs text-gray-400 mb-2">{dateStr}</p>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{task.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{task.category}</p>

            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">{progress}%</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    <div className={`w-6 h-6 rounded-full ${colorClasses[color]} flex items-center justify-center text-xs font-medium`}>
                        {task.title.charAt(0)}
                    </div>
                </div>
                <span className={`days-badge ${getDaysClass()}`}>
                    {daysLeft} days left
                </span>
            </div>
        </motion.div>
    );
};

export default TaskCard;
