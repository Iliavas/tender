import axios from 'axios'

var origin = 'http://10.10.117.207:8000/api/'

export const getRegions = async () => {
    var res = await axios.get(origin + 'data/regions')
    return res.data;
}

export const getOQued = async () => {
    var res = await axios.get(origin + 'data/okved?page=1&page_size=10');
    return res.data;
}

export const getCompanyStats = async (region: number, okved: number) => {
    var res = await axios.post(
        origin + 'statistics/region',
        {
            region: region,
            okved: okved
        }
    );
    return res.data;
}

export const getInnStats = async (region: number, okved: number, inn: string) => {
    var res = await axios.post(
        origin + 'statistics/company',
        {
            region: region,
            okved: okved,
            inn: inn
        }
    );
    return res.data;
}

export const getMapStats = async (okved: number) => {
    var res = await axios.post(
        origin + 'statistics/okved',
        {
            code: okved
        }
    )
    return res.data;
}

export const getFullCompanyStats = async (inn: number) => {
    var res = await axios.post(
        origin + 'statistics/full-company',
        {
            inn: inn
        }
    );
    return res.data;
}

export const getGlobalStat = async () => {
    var res = await axios.get(
        origin + 'data/global'
    )
    return res.data;
} 