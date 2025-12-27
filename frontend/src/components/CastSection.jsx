const CastSection = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-white text-3xl font-bold mb-8">Cast ({cast.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {cast.map((member, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors">
                            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    {member.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-white font-medium text-sm mb-1">{member.name}</h3>
                            <p className="text-gray-400 text-xs">{member.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CastSection;
