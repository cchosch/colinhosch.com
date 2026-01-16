
export type CityDetails = {
    [key: string]: {"lat": number, "lon": number}
};
const locations: {
    T1: CityDetails,
    "T1.5": CityDetails,
    T2: CityDetails,
    T3: CityDetails,
} = {
    "T1": {
        "Beijing": {"lat": 40.190632, "lon": 116.412144},
        "Shanghai": {"lat": 31.2312707, "lon": 121.4700152},
        "Guangzhou": {"lat": 23.1288454, "lon": 113.2590064},
        "Shenzhen": {"lat": 22.5445741, "lon": 114.0545429}
    },
    "T1.5": {
        "Chengdu": {"lat": 30.659867, "lon": 104.063315},
        "Kunming": {"lat": 25.0399353, "lon": 102.7169061},
        "Chongqing": {"lat": 30.05518, "lon": 107.8748712},
        "Hangzhou": {"lat": 30.2489634, "lon": 120.2052342},
        "Wuhan": {"lat": 30.5951051, "lon": 114.2999353},
        "Nanjing": {"lat": 32.0438284, "lon": 118.7788631},
        "Tianjin": {"lat": 39.0844897, "lon": 117.1956724},
        "Suzhou": {"lat": 31.311123, "lon": 120.6212881},
        "Xi'an": {"lat": 34.261004, "lon": 108.9423363},
        "Changsha": {"lat": 28.1987538, "lon": 112.9708685},
        "Shenyang": {"lat": 41.8026095, "lon": 123.4279105},
        "Qingdao": {"lat": 36.0663249, "lon": 120.3777659},
        "Zhengzhou": {"lat": 34.7472531, "lon": 113.619321},
        "Dalian": {"lat": 38.9130495, "lon": 121.6098013},
        "Dongguan": {"lat": 23.0183568, "lon": 113.7452332},
        "Ningbo": {"lat": 29.8622194, "lon": 121.6203873}
    },
    "T2": {
        "Xiamen": {"lat": 24.5438732, "lon": 118.0768065},
        "Fuzhou": {"lat": 26.0774954, "lon": 119.2918215},
        "Wuxi": {"lat": 31.5776626, "lon": 120.2952752},
        "Hefei": {"lat": 31.8665676, "lon": 117.281428},
        "Harbin": {"lat": 45.7593633, "lon": 126.6276177},
        "Jinan": {"lat": 36.6519754, "lon": 117.1138479},
        "Foshan": {"lat": 23.0239788, "lon": 113.1159558},
        "Changchun": {"lat": 43.8844201, "lon": 125.3180998},
        "Wenzhou": {"lat": 27.9963899, "lon": 120.695345},
        "Shijiazhuang": {"lat": 38.0429742, "lon": 114.5088385},
        "Nanning": {"lat": 22.8193063, "lon": 108.3627211},
        "Changzhou": {"lat": 31.8122623, "lon": 119.9691539},
        "Quanzhou": {"lat": 25.1901863, "lon": 118.338717},
        "Guiyang": {"lat": 26.6499922, "lon": 106.6246178},
        "Taiyuan": {"lat": 37.8699921, "lon": 112.5437075},
        "Yantai": {"lat": 37.461928, "lon": 121.4425255},
        "Jiaxing": {"lat": 30.7474425, "lon": 120.7510971},
        "Nantong": {"lat": 31.9827896, "lon": 120.8904588},
        "Jinhua": {"lat": 29.1080344, "lon": 119.6486487},
        "Zhuhai": {"lat": 22.273734, "lon": 113.5721327},
        "Huizhou": {"lat": 23.1125153, "lon": 114.4127007},
        "Xuzhou": {"lat": 34.2665258, "lon": 117.1810431},
        "Haikou": {"lat": 20.0462328, "lon": 110.1956502},
        "\u00dcr\u00fcmqi": {"lat": 43.8244074, "lon": 87.6139038},
        "Shaoxing": {"lat": 29.9992425, "lon": 120.576854},
        "Zhongshan": {"lat": 22.5197073, "lon": 113.3872302},
        "Taizhou": {"lat": 28.6581723, "lon": 121.4163876},
        "Jiujiang": {"lat": 29.6653828, "lon": 115.9474861},
        "Nanchang": {"lat": 28.6472124, "lon": 116.0348483},
        "Kashgar": {"lat": 39.4665981, "lon": 75.9900135}
    },
    "T3": {
        "Weifang": {"lat": 36.7070287, "lon": 119.1557515},
        "Baoding": {"lat": 38.8579735, "lon": 115.490696},
        "Zhenjiang": {"lat": 32.1891959, "lon": 119.4200069},
        "Yangzhou": {"lat": 32.3968554, "lon": 119.4077658},
        "Guilin": {"lat": 25.2779894, "lon": 110.2910622},
        "Tangshan": {"lat": 39.6295951, "lon": 118.1738712},
        "Sanya": {"lat": 43.1007714, "lon": 5.8788948},
        "Huzhou": {"lat": 30.8942995, "lon": 120.0851114},
        "Hohhot": {"lat": 40.8184528, "lon": 111.6601939},
        "Langfang": {"lat": 39.5302055, "lon": 116.6926134},
        "Luoyang": {"lat": 34.6196539, "lon": 112.4477046},
        "Weihai": {"lat": 37.5120997, "lon": 122.1152599},
        "Yancheng": {"lat": 33.349559, "lon": 120.1577019},
        "Linyi": {"lat": 35.1032403, "lon": 118.3506988},
        "Jiangmen": {"lat": 22.5816619, "lon": 113.0761073},
        "Shantou": {"lat": 23.3563921, "lon": 116.6775856},
        "Zhangzhou": {"lat": 24.2388257, "lon": 117.4524304},
        "Handan": {"lat": 36.6107711, "lon": 114.4857072},
        "Jining": {"lat": 35.4125047, "lon": 116.5849266},
        "Wuhu": {"lat": 31.1800568, "lon": 118.2141777},
        "Zibo": {"lat": 36.8129564, "lon": 118.0488401},
        "Yinchuan": {"lat": 38.4871699, "lon": 106.2266569},
        "Mianyang": {"lat": 31.4602714, "lon": 104.7160723},
        "Zhanjiang": {"lat": 21.2737079, "lon": 110.3548318},
        "Anshan": {"lat": 40.822222, "lon": 122.8275},
        "Ganzhou": {"lat": 25.703866, "lon": 115.348216},
        "Daqing": {"lat": 46.3240228, "lon": 124.5598093},
        "Yichang": {"lat": 30.6941332, "lon": 111.2803512},
        "Baotou": {"lat": 40.6174777, "lon": 109.944912},
        "Xianyang": {"lat": 34.3323227, "lon": 108.7128495},
        "Qinhuangdao": {"lat": 39.9395724, "lon": 119.5894129},
        "Zhuzhou": {"lat": 27.049812, "lon": 113.55087},
        "Putian": {"lat": 25.4965882, "lon": 118.8500963},
        "Jilin": {"lat": 43.7289674, "lon": 126.1997366},
        "Huai'an": {"lat": 33.5978169, "lon": 119.0196971},
        "Zhaoqing": {"lat": 23.0501661, "lon": 112.4603629},
        "Ningde": {"lat": 26.6695006, "lon": 119.5432715},
        "Hengyang": {"lat": 26.8971308, "lon": 112.5666191},
        "Nanping": {"lat": 27.3856975, "lon": 118.0753196},
        "Lianyungang": {"lat": 34.5933134, "lon": 119.2171662},
        "Dandong": {"lat": 40.1237658, "lon": 124.3821748},
        "Lijiang": {"lat": 26.8595868, "lon": 100.2249797},
        "Jieyang": {"lat": 23.553156, "lon": 116.3680354},
        "Yanbian Korean Autonomous Prefecture": {"lat": 42.906993, "lon": 129.463588},
        "Zhoushan": {"lat": 29.9873344, "lon": 122.2030363},
        "Lanzhou": {"lat": 36.474436, "lon": 103.733224},
        "Longyan": {"lat": 25.0767425, "lon": 117.0123483},
        "Luzhou": {"lat": 28.5297899, "lon": 105.5382725},
        "Fushun": {"lat": 41.8692972, "lon": 123.924157},
        "Xiangyang": {"lat": 32.010998, "lon": 112.1163785},
        "Shangrao": {"lat": 28.7435852, "lon": 117.40539},
        "Yingkou": {"lat": 40.6747155, "lon": 122.2357736},
        "Sanming": {"lat": 26.3355765, "lon": 117.442474},
        "Lishui": {"lat": 28.4704064, "lon": 119.9184297},
        "Yueyang": {"lat": 29.060703, "lon": 113.348653},
        "Qingyuan": {"lat": 23.6832984, "lon": 113.0505994},
        "Jingzhou": {"lat": 30.3375612, "lon": 112.2337264},
        "Tai'an": {"lat": 36.2002968, "lon": 117.0809316},
        "Quzhou": {"lat": 28.973887, "lon": 118.8540924},
        "Panjin": {"lat": 41.1796147, "lon": 122.0524321},
        "Dongying": {"lat": 37.4334738, "lon": 118.6689349},
        "Nanyang": {"lat": 33.0010496, "lon": 112.5292693},
        "Ma'anshan": {"lat": 31.6866105, "lon": 118.5048377},
        "Nanchong": {"lat": 31.210219, "lon": 106.231735},
        "Xining": {"lat": 36.6172544, "lon": 101.7761582},
        "Xiaogan": {"lat": 30.919414, "lon": 113.9516901},
        "Qiqihar": {"lat": 47.3392424, "lon": 123.9495373},
        "Liuzhou": {"lat": 25.0009993, "lon": 109.3414252}
    }
};

// Xinjiang, China (44.402393, 86.154785)\n\
// Sichuan, China (31.456781, 102.843018)\n\

/*
console.log(rawLocations.split("\n"));
const locations = rawLocations.split("\n").map((location: string) => {
    if(location.trim().length === 0)
        return;
    const [name, coords] = location.substring(0, location.length-1).split("(");
    // console.log(name + ' - ' + coords);
    if(name.split(",").length > 3)
        console.log(name);
    return [name, coords.split(",").map(v => parseFloat(v.trim()))] as [string, [number, number]];
}).filter(l => l).map(l => l!);*/

export default locations;
