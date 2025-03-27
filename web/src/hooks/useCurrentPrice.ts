import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface PriceData {
    symbol: string;
    price: number;
}

const useCurrentPrice = (coin: string) => {
    const [data, setData] = useState<PriceData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!coin) return;

            setLoading(true);
            try {
                const response = await axios.get<PriceData>(`${API_URL}/price/${coin}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
                setData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [coin]);

    return { data, loading };
}

export default useCurrentPrice;