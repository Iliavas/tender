import react from 'react'
import {Collapse, Divider, Input} from 'antd';
import './style.css'
import { getFullCompanyStats } from '../../client';
import { MyBar } from '../../elements/bar';
import {Typography} from 'antd';


export const Company: react.FC = () => {

    const [inn, setInn] = react.useState('');
    const [data, setData] = react.useState(null as any);

    return <div className='centered'>
        <div className="sizedd">
            <Input placeholder='ИНН' onChange={(e) => {
                setInn(e.target.value);
                if (e.target.value.length == 10) {
                    getFullCompanyStats(parseInt(e.target.value)).then((e) => {
                        console.log(e);
                        setData(e);
                    })
                }
            }}></Input>
            {
                data != null ?
                <div>
                    <MyBar
                        labels={data.okveds.map((e: any) => e.okved.substr(0, 20))}
                        values={data.okveds.map((e: any) => e.company_win_price)}
                        ratio={2}
                        title="ОКВЭДЫ компании (руб.)"
                    ></MyBar>
                    <MyBar
                        labels={data.okveds.map((e: any) => e.okved.substr(0, 20))}
                        values={data.okveds.map((e: any) => e.company_win_amount)}
                        ratio={2}
                        title="ОКВЭДЫ компании (количество выигранных тендеров)"
                    ></MyBar>
                    <MyBar
                        labels={['Текущее значение', '1 месяц', '2 месяца']}
                        values={data.predictions.map((e: any) => e.price)}
                        ratio={2}
                        title="Объем рынка (предсказание)"
                    ></MyBar>
                    <div style={{height: 20}}></div>
                    {data.okveds.map((e: any) => {
                        return <div>
                            <Typography.Title level={4}>{e.okved}</Typography.Title>
                            <Typography.Text>
                                Компания всего участвовала в <strong>{e.company_total_amount}</strong> тендерах
                            </Typography.Text>
                            <br />
                            <Typography.Text>
                                Компания получила <strong>{e.company_win_price}</strong> руб.
                            </Typography.Text>
                            <Divider></Divider>
                        </div>
                    })}
                    <Typography.Title level={4}>
                        Регионы компании
                    </Typography.Title>
                    {
                        data.regions.map((e: any) => {
                            return <Typography.Text>{e.region} (компания заработала <strong>{e.company_total_price}</strong> руб.)</Typography.Text> 
                        })
                    }
                </div> : <></>
            }
        </div>
    </div>
}