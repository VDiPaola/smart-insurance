//modules
import React from 'react';
import {ethers} from 'ethers'

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
//this.state.provider.getBalance(this.state.userAccount).then((r)=> console.log(ethers.utils.formatEther(r)))
const navItems = [
    {title:"Insurance", page:"1", needWallet:true},
    {title:"Governance", page:"2", needWallet:true},
    {title:"Staking", page:"3", needWallet:true},
    {title:"Docs", page:"4", needWallet:false}
]
const navItemTitles = navItems.map((item)=>{return item.title})

const fakeAddress = "0xie832d"

export default class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentPage: 0,
            userAccount: null,
            provider: null,
            signer: null
        }
        //check if metamask enabled
        if(typeof window.ethereum !== undefined){
            this.state.provider = new ethers.providers.Web3Provider(window.ethereum)
            this.state.signer = this.state.provider.getSigner()

            //prompt user to login to wallet
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts)=>{
                //store first account
                this.state.userAccount = accounts[0]
                //update user account when they change
                window.ethereum.on("accountChange", this.accountChange.bind(this))
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
        
    }


    accountChange(accounts){
        this.setState({
            userAccount: accounts[0]
        })
    }

    handleNavClick(title){
        this.setState({currentPage: navItems.findIndex(item => item.title === title)})
    }

    renderPage(){
        //if need wallet and not connected a wallet show noWalletPage
        let page = navItems[this.state.currentPage]
        if(page.needWallet){

        }
    }

    render(){
        return(
            <div id="dashboardContainer">
                <SideBar navItems={navItemTitles} onClick={this.handleNavClick.bind(this)}/>
                <div id="dashboard_pageContainer">
                    <TopBar title={title} crypto={test} address={fakeAddress}/>
                    <div id="dashboard_page">
                        {navItems[this.state.currentPage].page}
                    </div>
                </div>
            </div>
        )
    }
}

function NoWalletPage(props){
    return(
        <div id="dashboard_noWallet">
            <p>You Must Connect A Wallet To Use This Feature</p>
        </div>
    )
}