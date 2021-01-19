import * as React from 'react'
import { Button, Input, MenuItem, Select } from '@material-ui/core';
import axios from 'axios'

const sendToKitchen=async(pizzaType,coupon,amountAsNum,client)=>{
    if(client!=""){
        try{
            console.log('entered')
            const kitchenObj={
                pizzaType:pizzaType,
                coupon:coupon,
                amount:amountAsNum,
                client:client
            }
            await axios({
             method:'GET',
             url:'http://localhost:7500/orders/'   
            })
            .then((data)=>{
                console.log(data)
            })
            .catch((err)=>{
                console.log("something went horribly wrong:\n"+err)
            })
        }
        catch(err)
        {
            console.log("there was a problem with the kitchen:\n"+err)
        }
    }
}


const MainWindow = () => {

    const [pizzaType, setPizzaType] = React.useState(3)
    const [coupon,setCoupon]=React.useState(0)
    const [amount,setAmount]=React.useState(1)
    const [client,setClient]=React.useState("")

    return (
        <div className='container'>
            <h1 style={{ color: 'orange' }} >Welcome to Pizza Bangalo</h1>
            <Input placeholder="name..." onChange={(event)=>{setClient(event.target.value)}} />
            <div className="pizza-types">
                <label>pizza type:</label>
                <Select value={pizzaType} onChange={(event) => { setPizzaType(event.target.value) }}>
                    <MenuItem value={1} >pepperoni</MenuItem>
                    <MenuItem value={2} >jalapeno</MenuItem>
                    <MenuItem value={3} >basic</MenuItem>
                </Select>
                <label>discount?:</label>
                <Select value={coupon} onChange={(event) => { setCoupon(event.target.value) }}>
                    <MenuItem value={0} >no</MenuItem>
                    <MenuItem value={5} >yes-5%</MenuItem>
                    <MenuItem value={10} >yes-10%</MenuItem>
                    <MenuItem value={15} >yes-15%</MenuItem>
                </Select>
                <label>amount of pizzas:</label>
                <Input type="number" placeholder='amount... (default 1)' onChange={(event)=>{setAmount(event.target.value)}} />
            </div>
            <Button style={{backgroundColor:'blue'}} onClick={()=>{
                console.log("he clicked")
                const amountAsNum=(Number)(amount)
                sendToKitchen(pizzaType,coupon,amountAsNum,client)
            }} >ORDER</Button>
        </div>
    )
}


export default MainWindow