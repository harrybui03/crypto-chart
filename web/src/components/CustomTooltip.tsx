
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="custom-tooltip" style={{
            background: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
        }}>
            <p style={{ fontWeight: 'bold' }}>
                {new Date(label).toLocaleDateString()}
                <br />
                {new Date(label).toLocaleTimeString()}
            </p>
            <p>Price: ${payload[0].value.toLocaleString()}</p>
        </div>
    );
};
export default CustomTooltip;