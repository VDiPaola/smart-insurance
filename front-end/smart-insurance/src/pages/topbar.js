import UmbrellaIcon from '@material-ui/icons/BeachAccessSharp';

export default function TopBar(props){
    return(
        <div id="topbar">
            <Title title={props.title}/>
            <Pagination pages={props.pages}/>
            <DashboardButton />
        </div>
    )
}

function handleDashboardClick(){
    window.open("/dashboard", "_blank")
}

function Title(props){
    return(
        <div id="title">
            <div>
                <UmbrellaIcon />
            </div>
            <p>{props.title}</p>
        </div>
    )
}

function Pagination(props){
    const pages = props.pages.map((page)=>{
        return <li key={page.id}><a href={"#"+page.id}>{page.name}</a></li>
    })
    return(
        <ul id="pages">
            {pages}
        </ul>
    )
}

function DashboardButton(props){
    return(
        <div id="dashboard" onClick={handleDashboardClick}><div><p>Dashboard</p></div></div>
    )
}