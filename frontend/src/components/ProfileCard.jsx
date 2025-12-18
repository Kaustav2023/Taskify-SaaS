import { User } from 'lucide-react';

const ProfileCard = ({ username }) => {
    return (
        <div className="card p-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{username || 'User'}</h3>
                    <p className="text-sm text-gray-500">Task Manager</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
