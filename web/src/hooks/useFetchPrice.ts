import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useFetchPrice = (coin: string, range: string) => {
  const [data, setData] = useState<{ time: number; price: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/history/${coin}/${range}`,
        );

        const chartData = response.data.data
        setData(chartData);
      } catch (error) {
        console.error("error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [coin, range]);
  return { data, loading };
};

export default useFetchPrice;
