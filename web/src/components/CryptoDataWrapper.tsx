import {usePriceStore} from "../store/usePriceStore.ts";
import useCurrentPrice from "../hooks/useCurrentPrice.ts";
import {Box, CircularProgress, Typography} from "@mui/material";

const CryptoDataWrapper = ({ children }: { children: React.ReactNode }) => {
    const { coin } = usePriceStore();
    const { data, loading, error } = useCurrentPrice(coin);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!coin || error || !data) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <Typography variant="h6" color="textSecondary">
                    {!coin ? 'Please select a cryptocurrency' :
                        error ? 'Error loading data' : 'No data available'}
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
};

export default CryptoDataWrapper;