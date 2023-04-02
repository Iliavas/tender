import { Typography } from 'antd';
import react from 'react'
import { getGlobalStat } from '../../client';
import { MyPie } from '../../elements/pie';
import './style.css';


export const GlobalStat: react.FC = () => {
    const [data, setData] = react.useState(null as any);

    if (data == null) {
        setData({});
        getGlobalStat().then((e) => {
            setData(e);
        });
    }

    return <div className='centered'>
        <div className="sizedd">
            {
                data != null && data.destribution ?
                <MyPie
                data={
                    data.destribution.map((e: any) => {
                        return e.amount
                    })
                }
                title="Распределение ОКВЭДов"
                labels={
                    data.destribution.map((e: any) => {
                        return e.name
                    })
                }
            ></MyPie> : <></>    
            }
            {
                data != null && data.destribution ?
                <>    
                <Typography.Text>
                    Количество регионов: <strong>{data.regions_count}</strong>
                </Typography.Text>
                <br />
                <Typography.Text>
                    Количество компаний: <strong>{data.company_amount}</strong>
                </Typography.Text>
                <br />
                <Typography.Text>
                    Количество ОКВЭДов: <strong>{data.okved_count}</strong>
                </Typography.Text>
                </> : <></> 
            }
        </div>
    </div>
}