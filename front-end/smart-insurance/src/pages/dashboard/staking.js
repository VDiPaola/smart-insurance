const ethStakeContract = "placeHolder1"
const smartStakeContract = "placeHolder2"

export default function Staking(props){
    return(
        <div id="dashboard_staking">
            <Stake name="ETH" apy="5.1" staked="1" contract={ethStakeContract} onClickClaim={props.onClickClaim} onClickStake={props.onClickStake}/>
            <Stake name="SMART" apy="10" staked="5" contract={smartStakeContract} onClickClaim={props.onClickClaim} onClickStake={props.onClickStake}/>
        </div>
    )
}

function Stake(props){
    return(
        <div className="dashboard_stake">
            <h1>{props.name}</h1>
            <p className="dashboard_stakeApy">{props.apy}% APY</p>
            <p>{props.staked} staked</p>
            <div>
                <div onClick={()=>{props.onClickStake(props.contract)}}><span>Stake</span></div>
                <div onClick={()=>{props.onClickClaim(props.contract)}}><span>Claim</span></div>
            </div>
        </div>
    )
}