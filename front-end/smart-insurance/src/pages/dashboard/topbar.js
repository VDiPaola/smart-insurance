
export default function TopBar(props){
    return(
        <div id="dashboard_topbar">
            <h1>{props.title}</h1>
            <div>
                {formatAddress(props.address, props.onConnectClick)}
            </div>
            <Balance crypto={props.crypto}/>
        </div>
    )
}

function formatAddress(addr, onConnectClick){
    if(addr === null){
        return <div id="dashboard_topBarConnect" onClick={onConnectClick}><span>Connect</span></div>
    }else if (addr[0] !== "0") {
        return <p>{addr}</p>
    }else{
        return <p>{addr.slice(0,5) + "..." + addr.slice(addr.length-4,addr.length)}</p>
    }
    

}

function Balance(props){
    let items = "";
    if(props.crypto && Object.keys(props.crypto).length > 0){
        let keys = Object.keys(props.crypto)
        items = keys.map((name)=>{
            return <div key={name}>{props.crypto[name] + " " + name}</div>
        })
    }

    return(
        <div id="dashboard_balance">
            {items}
        </div>
    )
}