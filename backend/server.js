import express  from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
import Axios from 'axios';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname, '../frontend/build')));

 // All remaining requests return the React app, so it can handle routing.
app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

//app.use(express.static('frontend/public'));
//app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'public', 'index.html')));

//app.use(express.static('frontend/build'));
//app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));


mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/yorton-dressing',
async(err)=>{
    if(err) throw err;
    console.log("conncted to db")
}
//Mongoose 6.0 no longer support!!
// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }
);


//redirect to here after linepay page payment confirm
app.get('/api/linepay/confirm', async (req, res) => {

    const headers = {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': process.env.LINE_PAY_CLIENT_ID,
        'X-LINE-ChannelSecret': process.env.LINE_PAY_CLIENT_SECRET
    };

    const body ={
        "amount": req.query.price,
        "currency": "TWD"
    }

    Axios.post(`https://sandbox-api-pay.line.me/v2/payments/${req.query.transactionId}/confirm`, body, {
        headers: headers
    })
    .then((response) => {
        if (response.data){

            res.send(response.data);

        }else{
            res.status(404).send({message: 'LinePay Confirm No Data'});
        }
    })
    .catch((error) => {
         res.status(404).send({message: error.message});
    });
});


app.post('/api/linepay/:id', async (req, res) => {

    const headers = {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': process.env.LINE_PAY_CLIENT_ID,
        'X-LINE-ChannelSecret': process.env.LINE_PAY_CLIENT_SECRET
    };

    const order = req.body;
    const orderId = req.params.id.toString();
     
    const body ={
        "amount": order.totalPrice,
        "productName": order.orderItems[0].name,
        "confirmUrl": `${process.env.FRONTEND_SITE}/order/${orderId}/${order.user}/${order.totalPrice}`,
        "orderId": orderId,
        "currency": "TWD"
    }

    Axios.post('https://sandbox-api-pay.line.me/v2/payments/request', body, {
        headers: headers
    })
    .then((response) => {
        if (response.data){
            const paymentUrl = response.data.info.paymentUrl.web;
            res.send({paymentUrl});
        }else{
            res.status(404).send({message: 'LinePay Request No Data'});
        }
    })
    .catch((error) => {
        res.status(404).send({message: error.message});
    });
});


app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);


app.get('/', (req, res) => {

    res.send('Server is ready');
});

app.use((err, req, res, next) => {//catch expressAsyncHandler error happened
    res.status(500).send({message: err.message});
});

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Serve at http://localhost:${port}`);
});