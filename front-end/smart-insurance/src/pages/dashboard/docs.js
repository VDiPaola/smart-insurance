import { Link } from "react-router-dom";


export default function Docs(props){
    return(
        <div id="dashboard_docsContainer">
            <div id="dashboard_docs">
                <h1>Documentation</h1>
                <div>
                    <Link to="/docs/tokenomics">High level overview of Tokenomics</Link>
                    <Link to="/docs/whitepaper">Whitepaper</Link>
                    <Link to="/docs/roadmap">Road map</Link>
                    <Link to="/docs/development">Development Documentation</Link>
                </div>
            </div>
        </div>
    )
}