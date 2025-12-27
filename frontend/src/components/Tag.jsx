const Tag = ({ children, color = 'bg-green-500', className = '' }) => {
    return (
        <div className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${color} ${className}`}>
            {children}
        </div>
    );
};

export default Tag;
