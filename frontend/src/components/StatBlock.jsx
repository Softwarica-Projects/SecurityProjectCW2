const StatBlock = ({ icon, count, label, bgColor = "bg-blue-600" }) => {
    return (
        <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center">
                <div className={`${bgColor} rounded-full p-3 mr-4`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p className="text-gray-400 text-sm">{label}</p>
                </div>
            </div>
        </div>
    );
};

export default StatBlock;
