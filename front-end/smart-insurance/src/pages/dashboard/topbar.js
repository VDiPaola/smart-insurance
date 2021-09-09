
export default function TopBar(props){
    return(
        <div id="dashboard_topbar">
            <h1>{props.title}</h1>
            <div>
                <p>{props.address}</p>
            </div>
            <Balance crypto={props.crypto}/>
        </div>
    )
}

function Balance(props){
    const items = props.crypto.map((item)=>{
        return <div>{item.amount + " " + item.name}</div>
    })

    return(
        <div id="dashboard_balance">
            {items}
        </div>
    )
}