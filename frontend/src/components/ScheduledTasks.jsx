import { MoreHorizontal } from 'lucide-react';

const ScheduledTasks = ({ tasks }) => {
    // Sample scheduled tasks for the timeline
    const scheduledItems = [
        { id: 1, time: '10:00am - 12:00pm', title: 'UI Motion', color: 'purple' },
        { id: 2, time: '12:00pm - 01:00pm', title: 'UI Design', color: 'blue' },
    ];

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '01:00'];

    return (
        <div className="card p-4 flex-1">
            <div className="space-y-3">
                {timeSlots.map((time, index) => (
                    <div key={time} className="flex items-start gap-3">
                        <span className="text-xs text-gray-400 w-10 pt-1">{time}</span>
                        <div className="flex-1">
                            {scheduledItems.map((item) => {
                                if (item.time.startsWith(time.replace(':00', ''))) {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`p-3 rounded-lg ${item.color === 'purple' ? 'bg-purple-50' : 'bg-blue-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className={`font-medium text-sm ${item.color === 'purple' ? 'text-purple-700' : 'text-blue-700'
                                                        }`}>
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{item.time}</p>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            {!scheduledItems.some(item => item.time.startsWith(time.replace(':00', ''))) && (
                                <div className="h-1 border-b border-dashed border-gray-100" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduledTasks;
