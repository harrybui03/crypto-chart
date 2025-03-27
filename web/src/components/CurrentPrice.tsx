import {usePriceStore} from "../store/usePriceStore.ts";
import useCurrentPrice from "../hooks/useCurrentPrice.ts";
import {Box, CircularProgress, Typography} from "@mui/material";

const CurrentPrice = () => {
    const { coin } = usePriceStore();
    const { data, loading } = useCurrentPrice(coin);

    if (loading) return <CircularProgress />;

    if (!data) return <div>No price data available</div>;

    return (
        <Box sx={{ width: '100%', display: 'flex' ,justifyContent:'center' }}>
            <Typography variant="h3" gutterBottom>
                Current Price: ${data.price ?? 0}
            </Typography>
        </Box>
    );
};

export default CurrentPrice;