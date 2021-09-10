import UmbrellaIcon from '@material-ui/icons/BeachAccessSharp';
import React from 'react';

export default class SideBar extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            ActiveNav : 0
        }
        
        //create nav item list
        this.navItems = props.navItems.map((item, i)=>{
            let className = i === 0 ? " dashboard_navItemActive" : ""
            return <NavItem className={className} key={item} title={item} onClick={this.handleNavItemClick.bind(this)}/>
        })
    }

    handleNavItemClick(element, title){
        //remove current active sidebar nav item
        let curActive = document.getElementsByClassName("dashboard_navItemActive")[0]
        curActive.classList.remove("dashboard_navItemActive")
        //set new active element
        element.classList.add("dashboard_navItemActive")
        
        //pass title to dashboard
        this.props.onClick(title)
    }
    
    render(){
        return(
            <div id="dashboard_sidebar">
                <div id="dashboard_icon"><UmbrellaIcon /></div>
                <div id="dashboard_navContainer" >
                    {this.navItems}
                </div>
                
            </div>
        )
    }
}

function NavItem(props){
    return(
        <div className={"dashboard_navItem" + props.className} onClick={(e)=>{props.onClick(e.target,props.title)}}>
            <p>{props.title}</p>
        </div>
    )
}