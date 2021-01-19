import * as React from 'react'
import { Button, Input, MenuItem, Select } from '@material-ui/core';
import axios from 'axios'

const sendToKitchen = async (pizzaType, coupon, amountAsNum, client, sub) => {
    if (client != "") {
        try {
            console.log('entered')
            const kitchenObj = {
                "ingredientId": pizzaType,
                "coupon": coupon,
                "amount": amountAsNum,
                "client": client,
                "sub":sub
            }
            console.log(kitchenObj)
            await axios({
                method: 'POST',
                url: 'http://dcs-defense-project.herokuapp.com/orders/addOrder',  /*'http://localhost:7500/orders/addOrder',*/
                data: kitchenObj
            })
                .then(async (data) => {
                    try {
                        await axios({
                            method: 'PUT',
                            url: 'http://dcs-defense-project.herokuapp.com/ingredients/updateAmount',  /*'http://localhost:7500/ingredients/updateAmount',*/
                            data: {
                                "id": pizzaType,
                            }
                        })
                    }
                    catch (innerErr) {
                        if (innerErr)
                            console.log("this is innerErr:\n" + innerErr)
                    }
                })
                .catch((err) => {
                    console.log("something went horribly wrong:\n" + err)
                })

        }
        catch (err) {
            console.log("there was a problem with the kitchen:\n" + err)
        }
    }
}

const showOrders = (item) => {
    return (
        <div className='div-of-order'>
            <text className='single-order' key={item.id}>{item.client} {item.price} {item.pizzaType} </text>
            <Button style={{ backgroundColor: 'blue' }} onClick={()=>{
                axios({
                    method:'delete',
                    url:'http://dcs-defense-project.herokuapp.com/orders/deleteOrder',
                    data:{
                        "id":item.id
                    }
                })
            }} >Delete Order</Button>
        </div>
    )
}

const MainWindow = () => {

    const [pizzaType, setPizzaType] = React.useState(3)
    const [coupon, setCoupon] = React.useState(0)
    const [amount, setAmount] = React.useState(1)
    const [client, setClient] = React.useState("")
    const [orders, setOrders] = React.useState([])
    const[sub,setSub]=React.useState("")

    React.useEffect(async () => {
        await axios({
            method: 'get',
            url: 'http://dcs-defense-project.herokuapp.com/orders/'  /*'http://localhost:7500/orders/'*/
        })
            .then((data) => {
                setOrders(data.data)
                return
            })
    })

    return (
        <div className='container'>
            <h1 style={{ color: 'orange' }} >Welcome to Pizza Bangalo</h1>
            <Input placeholder="name..." onChange={(event) => { setClient(event.target.value) }} />
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
                <label>substitution?:</label>
                <Select value={sub} onChange={(event) => { setSub(event.target.value) }}>
                    <MenuItem value={""} >none</MenuItem>
                    <MenuItem value="blue cheese" >blue cheese</MenuItem>
                    <MenuItem value="whole wheat" >whole wheat</MenuItem>
                    <MenuItem value="vegan" >vegan</MenuItem>
                </Select>
                <label>amount of pizzas:</label>
                <Input type="number" placeholder='amount... (default 1)' onChange={(event) => { setAmount(event.target.value) }} />
            </div>
            <Button style={{ backgroundColor: 'blue' }} onClick={() => {
                console.log("he clicked")
                const amountAsNum = (Number)(amount)
                sendToKitchen(pizzaType, coupon, amountAsNum, client, sub)
            }} >ORDER</Button>
            <div className='my-orders'>
                {
                    orders.map(showOrders)
                }
            </div>
        </div>
    )
}


export default MainWindow


//order successful