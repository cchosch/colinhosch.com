

type CacheData = {
    total_seconds: number,
    text: string,
    decimal: string,
    digital: string,
    daily_average: number,
    is_up_to_date: boolean,
    percent_calculated: number,
    range: {
      start: string, // '2023-02-12T05:00:00Z'
      start_date: string, // '2023-02-12'
      start_text: string, // 'Sun Feb 12th 2023'
      end: string, // '2025-03-05T04:59:59Z'
      end_date: string, // '2025-03-04'
      end_text: string, // 'Today'
      timezone: string // 'America/New_York'
    },
    timeout: number
}

const wakaCache: {data: CacheData | null, lastFetched: number | null} = {
    data: null,
    lastFetched: null
};

const CACHE_DURATION = 1000 * 60 * 60;

export async function fetchWakaTimeHours(): Promise<CacheData | null> {
    const now = Date.now();

    if(wakaCache.data && wakaCache.lastFetched && now - wakaCache.lastFetched < CACHE_DURATION) {
        return wakaCache.data;
    }
    const resp = await fetch(
        "https://api.wakatime.com/api/v1/users/current/all_time_since_today",
        {
            headers: {
                "authorization": `Basic ${process.env.WAKATIME_API_KEY}`
            }
        }
    );

    const jsonResponse = (await resp.json());
    if("error" in jsonResponse) {
        console.error(jsonResponse);
        return null
    }
    wakaCache.data = jsonResponse.data;
    wakaCache.lastFetched = Date.now();
    return jsonResponse.data;
}
