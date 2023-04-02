import react from 'react'
import {Select, Input, Typography, Collapse} from 'antd'
import './style.css'
import { MyBar } from '../../elements/bar'
import { MyPie } from '../../elements/pie'
import { getCompanyStats, getInnStats, getOQued, getRegions } from '../../client'
import { Map } from '../../elements/map'

var yearLabels = ['текущий объем', '1 месяц', '2 месяца', '3 месяц', '4 месяца', '5 месяцев', '6 месяцев', '7 месяцев', '8 месяцев', '9 месяцев', '10 месяцев', '11 месяцев']


export const Statistics: react.FC = () => {
    const queried = react.useRef(false);
    const [regions, setRegions] = react.useState([]);
    const [oqued, setOQued] = react.useState([]);
    const [region, setRegion] = react.useState('');
    const [okved, setOqved] = react.useState('');
    
    const [predictionData, setPredictionData] = react.useState([]);
    const [companyData, setCompanyData] = react.useState(null as any);
    const [predictionStats, setPredictionStats] = react.useState({} as any);

    if (!queried.current) {
        queried.current = true;
        getRegions().then((e) => {
            setRegions(e);
        });
        getOQued().then((e) => {
            setOQued(e);
        })
    };
    return <div className='sized'>
        <div className='container'>
            <div className="inputs">
                <div className="regions">
                    <Select 
                        showSearch 
                        placeholder='Регион' 
                        style={{width: '100%'}}
                        dropdownAlign={{ offset: [0, 0] }}
                        filterOption={(input, option) => {
                            return (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                        }}
                        onChange={(e) => {
                            console.log(e);
                            setRegion(e);
                        }}
                    >
                        {
                            regions.map((e: any) => {
                                return <Select.Option key={e.id}>{e.name}</Select.Option>
                            })
                        }
                    </Select>
                    <Select 
                        showSearch 
                        placeholder='ОКВЭД' 
                        style={{width: '100%'}}
                        filterOption={(input, option) => {
                            return (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                        }}
                        onChange={(e) => {
                            setOqved(e);
                            console.log(e)
                            if (region.length) {
                                console.log(region)
                                getCompanyStats(
                                    parseInt(region), parseInt(e)
                                ).then((ee) => {
                                    setPredictionData(ee.predictions);
                                    setPredictionStats(ee);
                                })
                            }
                        }}
                    >
                        {
                            oqued.map((e: any) => {
                                return <Select.Option key={e.code}>{e.name}</Select.Option>
                            })
                        }
                    </Select>
                </div>
                <Input placeholder='ИНН компании' onChange={(e) => {
                    if (e.target.value.length == 10) {
                        getInnStats(parseInt(region), parseInt(okved), e.target.value).then((e) => {
                            setCompanyData(e);
                        })
                    }
                }}></Input>
            </div>
            <div className="stats">
                {
                    okved.length ? 
                    <Map okvedId={parseInt(okved)}></Map> : <></>
                }
                {
                    predictionData.length ?
                    <>
                        <Typography.Text>
                            Объем рынка в этом сегменте: <strong>{predictionStats.total_sum} руб</strong> (количество тендеров: <strong>{predictionStats.total_amount}</strong>)
                        </Typography.Text>
                        <MyBar 
                            labels={yearLabels}
                            values={predictionData.map((e: any) => e.sum)}
                            ratio={2}
                            title='Объем рынка'
                        ></MyBar>
                        <MyBar 
                            labels={yearLabels}
                            values={predictionData.map((e: any) => e.amount)}
                            ratio={2}
                            title='Количество тендеров'
                        ></MyBar>
                        <MyBar 
                            labels={yearLabels}
                            values={predictionData.map((e: any) => e.diff)}
                            ratio={2}
                            title='Разность конечной цены и начальной'
                        ></MyBar>
                    </> : <></>
                }
                
                <div className="company-stats">
                    <div className="company-stats-text">
                        {
                            companyData != null ?
                            <Collapse>
                            <Collapse.Panel header={`Объем рынка у компании: ${(companyData.company.win_price / companyData.company.total_price as any).toFixed(3) * 100.0}%`} key='1'>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <div style={{height: 300}}>
                                        <MyPie
                                            data={[companyData.company.win_price, companyData.company.total_price - companyData.company.win_price]}
                                            title={'Объем рынка (руб)'}
                                            labels={['Моя компания', 'Не моя компания']}
                                        ></MyPie>
                                    </div>
                                    <div style={{height: 300}}>
                                        <MyBar
                                            ratio={1 / 2}
                                            labels={['сейчас', 'месяц', 'два']}
                                            values={companyData.predictions.map((e: any) => e.price)}
                                            title='Предсказание объема рынка у компании'
                                        ></MyBar>
                                    </div>
                                </div>
                            </Collapse.Panel>
                            <Collapse.Panel header={`Сколько раз компания участвовала в тендерах: ${companyData.company.tender_amount}`} key='2'>
                            <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <div style={{height: 300}}>
                                        <MyPie
                                            data={[companyData.company.tender_amount, companyData.region_tenders - companyData.company.tender_amount]}
                                            title={'Количество участий в тендерах'}
                                            labels={['Моя компания', 'Не моя компания']}
                                        ></MyPie>
                                    </div>
                                    <div style={{height: 300}}>
                                        <MyBar
                                            ratio={1 / 2}
                                            labels={['сейчас', 'месяц', 'два']}
                                            values={companyData.predictions.map((e: any) => e.amount)}
                                            title='Предсказание к-ва участий'
                                        ></MyBar>
                                    </div>
                                </div>
                            </Collapse.Panel>
                            <Collapse.Panel header={`Проигранных тендеров: ${(companyData as any).company_market_tenders - (companyData as any).company.win_amount}`} key='3'>
                            <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <div style={{height: 300}}>
                                        <MyPie
                                            data={[(companyData as any).company.win_amount, (companyData as any).company_market_tenders - (companyData as any).company.win_amount]}
                                            title={'Проигранных тендеров (кол-во)'}
                                            labels={['Остальные тендеры', 'Проигранные тендеры']}
                                        ></MyPie>
                                    </div>
                                    <div style={{height: 300}}>
                                    <MyPie
                                            data={[companyData.company.win_price, (companyData as any).company.total_price - (companyData as any).company.win_price]}
                                            title={'Проигранных тендеров (руб)'}
                                            labels={['Остальные тендеры', 'Проигранные тендеры']}
                                        ></MyPie>
                                    </div>
                                </div>
                            </Collapse.Panel>
                            <Collapse.Panel header={`Выигранных тендеров: ${(companyData as any).company.win_amount}`} key='4'>
                            <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}
                                >
                                    <div style={{height: 300}}>
                                        <MyPie
                                            data={[companyData.company.win_amount, (companyData as any).company_market_tenders - (companyData as any).company.win_amount]}
                                            title={'Выигранных тендеров (кол-во)'}
                                            labels={['Выигранные тендеры', 'Остальные тендеры']}
                                        ></MyPie>
                                    </div>
                                    <div style={{height: 300}}>
                                        <MyPie
                                            data={[companyData.company.win_price, (companyData as any).company.total_price - (companyData as any).company.win_price]}
                                            title={'Выигранных тендеров (руб)'}
                                            labels={['Выигранные тендеры', 'Остальные тендеры']}
                                        ></MyPie>
                                    </div>
                                </div>
                            </Collapse.Panel>
                        </Collapse> : <></>
                        }
                        </div>

                </div>
            </div>
        </div>
   </div>
}