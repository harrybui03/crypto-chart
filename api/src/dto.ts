export interface CurrentPrice {
    price: number;
    symbol: string;
}

export interface HistoryChart {
    data: HistoryChartData[];
}

export interface HistoryChartData {
    price: number;
    time: number;
}
