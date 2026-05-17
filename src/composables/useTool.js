export function useTool() {

    // 格式化
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        let str = num.toString();
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 政黨顏色轉換
    const getPartyColor = (party) => {
        switch (party) {
            case 'DPP':
                return '#28945E'; // 民進黨
            case 'KMT':
                return '#005599'; // 國民黨
            case 'TPP':
                return '#28C7C7'; // 民眾黨
            default:
                return '';
        }
    };

    // 政黨全名轉換
    const getPartyName = (party) => {
        const names = {
            'DPP': '民主進步黨',
            'KMT': '中國國民黨',
            'TPP': '台灣民眾黨'
        };
        return names[party];
    };

    return {
        formatNumber,
        getPartyColor,
        getPartyName
    };
}