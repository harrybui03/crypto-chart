import {useEffect, useState} from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const useCurrentPrice = (coin: string) => {
    const [data , setData] = useState<{symbol: string ; price: number}>(null);
    const [loading , setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/price/${coin}`);
                const currentPrice = response.data;
                setData(currentPrice)
            } catch (error){
                console.error("error fetching data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [coin]);

    return {data , loading}
}

export default useCurrentPrice;