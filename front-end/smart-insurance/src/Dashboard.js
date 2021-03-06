//modules
import React from 'react';
import {ethers} from 'ethers'
import {BrowserRouter as Route, Switch, useRouteMatch, useHistory} from 'react-router-dom'

//pages
import TopBar from './pages/dashboard/topbar';
import SideBar from './pages/dashboard/sidebar';
import Insurance from './pages/dashboard/insurance';
import Governance from './pages/dashboard/governance';
import Staking from './pages/dashboard/staking';
import Docs from './pages/dashboard/docs';


//styles
import './styles/dashboard/Dashboard.css'
import './styles/dashboard/topbar.css'
import './styles/dashboard/sidebar.css'
import './styles/dashboard/insurance.css'
import './styles/dashboard/governance.css'
import './styles/dashboard/staking.css'
import './styles/dashboard/docs.css'

//vars
const title = "Smart Insurance Dashboard"

const navItems = [
    {title:"Insurance", needWallet:true},
    {title:"Governance", needWallet:true},
    {title:"Staking", needWallet:true},
    {title:"Docs", needWallet:false}
]
const navItemTitles = navItems.map((item)=>{return item.title})

const networkName = "rinkeby"

const insuranceManagerAddress = ""
const insuranceManagerAbi = ""

export default class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentPage: -1,
            currentPageIndex: 0,
            userAccount: null,
            provider: null,
            signer: null,
            balances: {},
            networkName: null,
        }
        
    }

    componentDidMount(){
        //check if metamask enabled
        if(typeof window.ethereum !== undefined){
            //set etherjs provider and signer
            this.setState({
                provider: new ethers.providers.Web3Provider(window.ethereum, "any")
                // The "any" network will allow spontaneous network changes
            },()=>{
                this.setState({signer: this.state.provider.getSigner()})
                this.networkChange()
            })
        }
    }

    connectWallet(){
        if(typeof window.ethereum !== undefined){
            //prompt user to login to wallet
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts)=>{
                //store first account
                this.setState({userAccount: accounts[0]}, ()=>{
                    //update user balance
                    this.getBalance()
                    //set initial page
                    this.setState({currentPage: this.state.networkName === networkName ? this.state.currentPageIndex : -1})
                    //intervals for checking user still has wallet connected
                    this.accountInterval()
                })
                //update user account when they change
                window.ethereum.on("accountChange", this.accountChange.bind(this))
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    async networkChange(){
        //store current network
        const network = await this.state.provider.getNetwork()
        this.setState({networkName: network.name}, ()=>{
            this.connectWallet()
        })
        //refreshes page on network change to stop issues from happening
        this.state.provider.on("network", (newNetwork, oldNetwork) => {
            /* When a Provider makes its initial connection, it emits a "network"
            event with a null oldNetwork along with the newNetwork. So, if the
            oldNetwork exists, it represents a changing network */
            if (oldNetwork) {
                window.location.reload();
            }
        });
    }

    accountInterval(){
        //checks wallet is still logged in and updates balance
        setInterval(()=>{
            this.getBalance()
            this.state.provider.listAccounts()
            .then((accounts)=>{
                if (accounts === null || accounts.length < 1){
                    //refresh page
                    window.location.reload()
                }
            })
        }, 5 * 1000);
        
    }


    accountChange(accounts){
        this.setState({
            userAccount: accounts[0]
        })
    }

    handleNavClick(title){
        //update to the right page
        let pageIndex = navItems.findIndex(item => item.title === title)
        let needWallet = navItems[pageIndex].needWallet
        //if need wallet and a wallet is not connected show the noWallet or WrongNetwork page
        if(needWallet && this.state.provider !== null){
            //make sure they are on the right network
            if(this.state.networkName !== networkName){
                this.setState({currentPage: -1})
            }else{
                //check if there is atleast 1 account
                this.state.provider.listAccounts()
                .then((accounts)=>{
                    if (accounts.length > 0){
                        this.setState({currentPage: pageIndex})
                    }else{
                        this.setState({currentPage: -1})
                    }
                })
            }
        }else{
            this.setState({currentPage: pageIndex})
        }

        this.setState({currentPageIndex: pageIndex})
    }

    getBalance(){
        //make sure provider exists
        if(this.state.provider != null){
            //get balance for user account
            this.state.provider.getBalance(this.state.userAccount)
                .then((r)=> {
                    //update copy of balance then set state
                    let balancesCopy = Object.assign({}, this.state.balances)
                    balancesCopy["ETH"] = formatBalance(ethers.utils.formatEther(r))
                    this.setState({balances: balancesCopy})
                })
                .catch((err)=>console.log(err))
        }
    }

    handleClickStake(contract){
        console.log(contract)
    }
    handleClickClaim(contract){
        console.log(contract)
    }

    renderPage(path, url, history){
        switch(this.state.currentPage){
            case 0:
                return <Insurance url={url} history={history}/>
            case 1:
                return <Governance />
            case 2:
                return <Staking onClickClaim={this.handleClickClaim.bind(this)} onClickStake={this.handleClickStake.bind(this)}/>
            case 3:
                return <Docs />
            default:
                return this.state.networkName !== "rinkeby" ? <WrongNetwork /> : <NoWalletPage />
        }
    }


    render(){
        return(
            <div id="dashboardContainer">
                <SideBar navItems={navItemTitles} onClick={this.handleNavClick.bind(this)}/>
                <div id="dashboard_pageContainer">
                    <TopBar title={title} crypto={this.state.balances} address={this.state.userAccount} onConnectClick={this.connectWallet.bind(this)}/>
                    <div id="dashboard_page">
                        <PageRouting provider={this.state.provider} page={this.renderPage.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

function PageRouting(props){
    //handles routing for specific insurance so you can go directly go to those pages from the main site
    let { path, url } = useRouteMatch();
    const history = useHistory();

    return(
        <Switch>
            <Route exact path={path}>{props.page(path, url, history)}</Route>
            <Route path={path + "/weatherInsurance"}><BuyInsurance type="weather" provider={props.provider}/></Route>
        </Switch>
    )
}

function NoWalletPage(props){
    return(
        <div id="dashboard_noWallet">
            <p>You Must Connect A Wallet To Use This Feature</p>
        </div>
    )
}
function WrongNetwork(props){
    return(
        <div id="dashboard_wrongNetwork">
            <p>You must connect to the rinkeby test network</p>
        </div>
    )
}

//formats number to the first 2 non zero values
function formatBalance(balance) {
    return balance.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0]
}


class BuyInsurance extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            //contract: new ethers.Contract(insuranceManagerAddress,insuranceManagerAbi,props.provider)
        }
    }

    handleBuy(){
        if(this.props.type.toLowerCase() === "weather"){
            this.state.contract.buyWeatherInsurance("cityCountry", {value:ethers.utils.parseEther("0.25")})
        }
    }

    render(){return(
        <div id="dashboard_buyInsurance">
            {this.props.type}
            <button type="button" onClick={this.handleBuy.bind(this)}>Buy Insurance</button>
        </div>
    )}
}