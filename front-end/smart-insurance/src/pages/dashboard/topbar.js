
export default function TopBar(props){
    return(
        <div id="dashboard_topbar">
            <h1>{props.title}</h1>
            <div>
                <p>{formatAddress(props.address)}</p>
            </div>
            <Balance crypto={props.crypto}/>
        </div>
    )
}

function formatAddress(addr){
    if (addr[0] !== "0") {return addr}
    return addr.slice(0,5) + "..." + addr.slice(addr.length-4,addr.length)

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