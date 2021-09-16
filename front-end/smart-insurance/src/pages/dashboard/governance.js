import Pagination from '@material-ui/lab/Pagination';
import React from 'react';

import testProposals from './testProposals.json'

export default class Governance extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            page:1,
            perPage: 6,
            proposals: testProposals,
            isExpandedProposal:false,
            expandedProposal: {title:"",description:""}
        }
    }

    getPages(){
        return this.state.proposals.slice(this.state.perPage*(this.state.page-1), this.state.perPage*this.state.page)
    }

    handlePageChange(event, page){
        this.setState({page:page})
    }
    handleClickApprove(item){
        console.log(item)
    }
    handleClickDeny(item){
        console.log(item)
    }
    handleClickReadMore(title, description){
        this.setState({isExpandedProposal: true , expandedProposal: {title:title, description: description}})
    }
    handleCloseExpandedProposal(){
        this.setState({isExpandedProposal: false})
    }

    render(){
        return(
            <div id="dashboard_governance">
                <h1>Proposals</h1>
                <p>Use Smart tokens to vote on future changes to the platform</p>
                <Proposals 
                    onChange={this.handlePageChange.bind(this)} 
                    page={this.state.page} 
                    perPage={this.state.perPage} 
                    pageCount={Math.ceil(this.state.proposals.length/this.state.perPage)} 
                    proposals={this.getPages()}
                    onClickApprove={this.handleClickApprove}
                    onClickDeny={this.handleClickDeny}
                    onClickReadMore={this.handleClickReadMore.bind(this)}
                    />
                {this.state.isExpandedProposal && <ExpandedProposal 
                                                    onClickClose={this.handleCloseExpandedProposal.bind(this)}
                                                    proposal={this.state.expandedProposal}
                                                    />}
            </div>
        )
    }
}

function Proposals(props){
    //all proposals and pagination
    const proposals = props.proposals.map((item)=>{
        return <Proposal 
            key={item.id} 
            title={item.title} 
            description={item.description} 
            status={item.status} 
            approveVotes={item.approveVotes} 
            denyVotes={item.denyVotes}
            onClickApprove={props.onClickApprove}
            onClickDeny={props.onClickDeny}
            onClickReadMore={props.onClickReadMore}
            />
    })

    return(
        <div id="dashboard_proposalsContainer">
            <div id="dashboard_proposals">{proposals}</div>
            <Pagination count={props.pageCount} variant="outlined" shape="rounded" page={props.page} onChange={props.onChange}/>
        </div>
    )
}

function Proposal(props){
    //individual proposal card
    const maxDescriptionChars = 100
    const description = props.description
    const totalVotes = props.approveVotes + props.denyVotes
    const denyGreater = props.denyVotes > props.approveVotes

    return(
        <div className="dashboard_proposal">
            <h1>{props.title}</h1>
            <p>
                {description.length > maxDescriptionChars ? <span>{description.slice(0, maxDescriptionChars)} 
                <span className="dashboard_readMore" onClick={()=>{props.onClickReadMore(props.title,props.description)}}> read more...</span></span> : description}
            </p>
            <div className="dashboard_proposalStatusContainer">
                {((props.status === 1 || props.status === 2) && (
                    <div className={"dashboard_proposalStatus " + (props.status === 1 ? "statusDeny" : "statusApprove")}>
                        {props.status === 1 ? "Denied" : "Approved"}
                    </div>
                )) || (
                    <div className="dashboard_voteButtons"><div onClick={()=>{props.onClickApprove(props.title)}}>Approve</div><div onClick={()=>{props.onClickDeny(props.title)}}>Deny</div></div>
                )}
                <div className="dashboard_voteBar"><div style={{width: `${(props.approveVotes / totalVotes) * 100}%`}}/></div>
                <p>total votes: {totalVotes} ({Math.floor((denyGreater ? (props.denyVotes / totalVotes) : (props.approveVotes / totalVotes)) * 100)}% {denyGreater ? "Denied" : "Approved"})</p>
            </div>
        </div>
    )
}

function ExpandedProposal(props){
    return(
        <div className="dashboard_expandedProposal">
            <div>
                <h1>{props.proposal.title}</h1>
                <p>{props.proposal.description}</p>
                <div onClick={props.onClickClose}><span>Close</span></div>
            </div>
        </div>
    )
}