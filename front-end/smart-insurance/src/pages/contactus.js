import React from "react"
import Button from '@material-ui/core/Button';


export default class ContactUs extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name:"",
            subject:"",
            message:""
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
    }

    handleNameChange(event){
        this.setState({name:event.target.value})
    }
    handleSubjectChange(event){
        this.setState({subject:event.target.value})
    }
    handleMessageChange(event){
        this.setState({message:event.target.value})
    }

    handleFormSend(){
        let name = this.state.name
        let subject = this.state.subject
        let message = this.state.message
        alert("Temporary")
        window.open(`mailto:test@example.com?subject=${subject}&body=${message}`);
        
    }

    render(){
        return(
            <div id="contactUs">
                <h1>Contact Us</h1>
                <Form 
                    onNameChange={this.handleNameChange}
                    onSubjectChange={this.handleSubjectChange}
                    onMessageChange={this.handleMessageChange}
                    />
                <div id="contactUsSendContainer">
                    <Button variant="contained" id="temp" onClick={this.handleFormSend.bind(this)}>SEND</Button>
                </div>
            </div>
        )
    }
}

function Form(props){
    return(
        <div id="contactUsForm">
            <input type="text"  placeholder="Your name.." onChange={props.onNameChange}/>
            <input type="text"  placeholder="Subject" onChange={props.onSubjectChange}/>
            <textarea placeholder="Message" onChange={props.onMessageChange}></textarea>
        </div>
    )
}
