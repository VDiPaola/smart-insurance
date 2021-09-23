import React from "react"
import Button from '@material-ui/core/Button';


export default class ContactUs extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email:"",
            subject:"",
            message:""
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleSubjectChange = this.handleSubjectChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
    }

    handleEmailChange(event){
        this.setState({email:event.target.value})
    }
    handleSubjectChange(event){
        this.setState({subject:event.target.value})
    }
    handleMessageChange(event){
        this.setState({message:event.target.value})
    }

    handleFormSend(){
        let subject = this.state.subject
        let message = this.state.message
        //let email = this.state.email
        //temporary
        window.open(`mailto:test@example.com?subject=${subject}&body=${message}`);
        
    }

    render(){
        return(
            <div id="contactUs">
                <h1>Contact Us</h1>
                <Form 
                    onEmailChange={this.handleEmailChange}
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
            <input type="text"  placeholder="Email" onChange={props.onEmailChange}/>
            <input type="text"  placeholder="Subject" onChange={props.onSubjectChange}/>
            <textarea placeholder="Message" onChange={props.onMessageChange}></textarea>
        </div>
    )
}
