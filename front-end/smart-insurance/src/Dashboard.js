//modules
import React from 'react';
import ReactDOM from 'react-dom';

//pages
import TopBar from './pages/dashboard/topbar';
import SideBar from './pages/dashboard/sidebar';


//styles
import './styles/dashboard/Dashboard.css'
import './styles/dashboard/topbar.css'
import './styles/dashboard/sidebar.css'

//vars
const title = "Smart Insurance Dashboard"
const test = [
    {name:"ETH", amount:0.12},
    {name:"SMART", amount:150}
]
const fakeAddress = "0xie832d"

export default class Dashboard extends React.Component{
    render(){
        return(
            <div id="dashboardContainer">
                <SideBar />
                <TopBar title={title} crypto={test} address={fakeAddress}/>
            </div>
        )
    }
}
