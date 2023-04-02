import React from 'react';
import { Map } from './elements/map';
import { Statistics } from './pages/statistics';
import {Tabs} from 'antd';
import { Company } from './pages/company';
import { GlobalStat } from './pages/globalStat';


function App() {

    return (
        <div style={{padding: 20}}>
            <Tabs items={[
                {
                    key: '1',
                    label: 'Статистика',
                    children: <Statistics></Statistics>
                },
                {
                    key: '2',
                    label: 'Компания',
                    children: <Company></Company>
                },
                {
                    key: '3',
                    label: 'Глобальная статистика',
                    children: <GlobalStat></GlobalStat>
                }
            ]}></Tabs>
        </div>
    );
}

export default App;
