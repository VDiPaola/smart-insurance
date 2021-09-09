//modules
import React, { useEffect, useState } from 'react';
import {ProductList} from './ProductList'

//pages
import TopBar from './pages/topbar'
import OurMission from './pages/ourmission'
import Products from './pages/products'
import HowItWorks from './pages/howitworks'
import ContactUs from './pages/contactus'


//styles
import './styles/App.css'
import './styles/topbar.css'
import './styles/ourMission.css'
import './styles/products.css'
import './styles/howitworks.css'
import './styles/contactus.css'

//fonts
import './fonts.css'

//images
import shape1 from './images/shape1.svg'
import shape2 from './images/shape2.svg'
import shape3 from './images/shape3.svg'
import shape4 from './images/shape4.svg'


//vars
const title = "Smart Insurance"
const pages = [
    {name:"Our Mission", id:"ourMissionContainer"},
    {name:"Products", id:"products"},
    {name:"How It Works", id:"howItWorks"},
    {name:"Contact Us", id:"contactUs"}
]



export default class App extends React.Component{
    handleBuy(id){
        console.log(id + " clicked buy")
    }

    render(){
        return(
            <div id="app">
                <HandleScroll />
                <TransparentTopbar />

                <img alt="cosmetic shape" src={shape1} className="backgroundShape" id="backgroundShape1"/>
                <img alt="cosmetic shape" src={shape2} className="backgroundShape" id="backgroundShape2"/>
                <img alt="cosmetic shape" src={shape3} className="backgroundShape" id="backgroundShape3"/>
                <img alt="cosmetic shape" src={shape4} className="backgroundShape" id="backgroundShape4"/>

                <TopBar title={title} pages={pages}/>
                <OurMission />
                <Products 
                    products={ProductList} 
                    onClickBuy={this.handleBuy}
                    />
                <HowItWorks />
                <ContactUs />
            </div>
        )
    }
}

function TransparentTopbar(props){
    return(
        <div id="transparentTopbar"></div>
    )
}


function HandleScroll () {

    const [offset, setOffset] = useState(0);
  
    useEffect(() => {
      window.onscroll = () => {
        setOffset(window.pageYOffset)
      }
    }, []);
    
    let opacity = (offset >= 200 ? 200 : offset) / 200
    let el = document.getElementById("transparentTopbar") || null
    if(el){
        el.style.opacity = opacity
    }
    
    return(
        <div></div>
    )
  };