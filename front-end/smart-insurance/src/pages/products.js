
import Button from '@material-ui/core/Button';

export default function Products(props){
    const productItems = props.products.map((item,index)=>{
        return <ProductItem 
            key={item.id} 
            img={item.img}
            identifier={item.id}
            description={item.description}
            onClickBuy={props.onClickBuy}
            />
    })

    return(
        <div id="products">
            <h1>Insurance Products</h1>
            <div id="productList">
                {productItems}
            </div>
        </div>
    )
}

function ProductItem(props){
    return(
        <div className="productItem">
            <img src={props.img} alt=""/>
            <p>{props.description}</p>
            <div>
                <Button variant="contained" onClick={()=>{props.onClickBuy(props.identifier)}}>Buy</Button>
            </div>
            
        </div>
    )
}
