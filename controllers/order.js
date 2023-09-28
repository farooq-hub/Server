const Stripe = require('stripe')
const Order = require('../models/order')
const Provider = require('../models/provider')
const User = require('../models/user')


// const Razorpay = require('razorpay')
const stripe = Stripe(process.env.STRIPE_KEY)


const getOrderLists =async (req,res) => {

  try {

    const { filter,skip,path,role } = req.query;
    let { id } = req.payload;
    let orderList = []
    if(role == 'user'){
      if(path =='/profile') orderList = await Order.find({customerId:id}).skip(skip).limit(5).populate({path: 'providerId',select: 'name'}).sort({ orderCreatedAt:1 });
      else orderList = await Order.find({customerId:id}).populate({path: 'providerId',select: 'name'}).sort({ orderCreatedAt:1 });
    }else if(role == 'provider')orderList = await Order.find({providerId:id}).skip(skip).limit(10).sort({ orderCreatedAt:1 });
    else if(role == 'admin')orderList = await Order.find({}).skip(skip).limit(10).populate({path: 'providerId',select: 'name '}).sort({ orderCreatedAt:1 });

    console.log(orderList,id);
    res.status(200).json({ orderList });
    
  } catch (error) {
    res.status(504).json({ errMsg: "Gateway time-out" });
  }

}

const getOrderData =async (req,res) => {

    const { id } = req.params;
    if(id){
        const orderData = await Order.findOne({_id:id})
        .populate([{path:'providerId',select: 'name phone email location'},{
          path: 'options.optionId',
          populate :{
            path: 'serviceId',
            select:'serviceName'
          }
        }])
        console.log(orderData);
        res.status(200).json({ orderData });
    }
}


const paymentModeHandle = async (req, res) => {
  try {
    const { method } = req.query
    const orderDetails = req.body
    console.log(method);
    console.log(orderDetails);
    if(method === 'strip'){
        const queryParams = new URLSearchParams({
            status: 'success',
            orderDetail: JSON.stringify(orderDetails),
          });
        const date = new Date()
        const user = await stripe.customers.create({
            metadata: {
              userId: orderDetails.customerId,
              orderCreatAt: date,
              price : orderDetails.grandTotal
            }
          })
        const session = await stripe.checkout.sessions.create({
            customer: user.id,
            line_items: [
              {
                price_data: {
                  currency: 'inr',
                  product_data: {
                    name:'Total grand price',
                    metadata: {
                      id: orderDetails.option[0]._id
                    }
                  },
                  unit_amount:  orderDetails.grandTotal * 100,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${process.env.SERVER_URL}/payment?${queryParams}`,
            cancel_url: `${process.env.SERVER_URL}/payment?status=fail`,
          })
          res.send({ url: session.url })
      }
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
    console.log(error)
  }
}


const paymentStatusHandle = async(req,res)=>{
  try {
    const {status,orderDetail} = req.query
    const date = new Date();
    const orderDetails = JSON.parse(orderDetail);;
    console.log(orderDetails,'dfsjhfsjdfzsjhdfjshdf');

    if(status === 'success'&&orderDetails){
        const order = new Order({
            providerId : orderDetails.providerId,
            customerId : orderDetails.customerId,
            name : orderDetails.name,
            mobile : orderDetails.mobile,
            email : orderDetails.email,
            eventDate : orderDetails.date,
            address : orderDetails.address,
            options : orderDetails.option,
            grandTotal : orderDetails.grandTotal,
            paymentType :'strip',
            orderCreatedAt : date
        })
        const save = await order.save()
        if(save){
          const price = Math.floor((orderDetails.grandTotal*90)/100)
          const walletHistory = {date:new Date(),amount:price,from:orderDetails.customerId,transactionType:'Credit'}
          const updateProvider = await Provider.updateOne({_id:orderDetails.providerId},
            {$inc:{wallet:price},$push:{walletHistory:walletHistory}})
            return updateProvider && res.redirect(`${process.env.CLIENT_URL}/payments?status=true`)
        }else return res.redirect(`${process.env.CLIENT_URL}/payments?status=false&`)
    }else{
        return res.redirect(`${process.env.CLIENT_URL}/payments?status=false&`)
    }
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/payments?status=false`)
    console.log(error.message);
  }
}


const cancelOrder = async (req,res) => {  
  try {
    const { id } = req.query;
    console.log(id);
    if(id){
      const date =new Date()
      const cancel = await Order.findOneAndUpdate({_id:id},{$set:{status:'Canceled',orderCancelledAt:date}});
      if(!cancel) res.status(500).json({ errMsg: "Server error" ,status:false})
      const price = Math.floor((cancel.grandTotal*90)/100)
      const walletHistoryUser = {date:date,amount:cancel.grandTotal,from:cancel.providerId,transactionType:'Credit'}
      const walletHistoryProvider = {date:date,amount:price,from:cancel.customerId,transactionType:'Debit'}

      const userUpdate = await User.updateOne({_id:cancel.customerId},{$inc:{wallet:cancel.grandTotal},$push:{walletHistory:walletHistoryUser}});
      const providerUpdate = await Provider.updateOne({_id:cancel.providerId},{$inc:{wallet:-price},$push:{walletHistory:walletHistoryProvider}});
      console.log(id,cancel , userUpdate, providerUpdate);

       userUpdate && providerUpdate ? res.status(200).json({ msg:'Order Cancelled successfully',status:true ,date})
      :res.status(500).json({ errMsg: "Server error" ,status:false})
    }else{res.status(402).json({ errMsg: "Somthing wrong" ,status:false});}
    
  } catch (error) {
    res.status(500).json({ errMsg: "Server error",status:false });
  }
    
} 


const verifyrzpay = async (req,res) => {
  const razorpay_order_id = req.body?.response.razorpay_order_id;
  const razorpay_payment_id = req.body?.response.razorpay_payment_id;
  const razorpay_signature = req.body?.response.razorpay_signature
  const {course_id ,amount,mode_of_payment }= req.body.purchaseData

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  try{
    const generated_signature = crypto.createHmac('sha256',process.env.RAZORPAY_PASS)
    .update(body, 'utf-8')
    .digest('hex')
  
    if(generated_signature === razorpay_signature){
      const parsedDate = new Date();
      parsedDate.setDate(parsedDate.getDate());
      const purchase_date = parsedDate.toISOString();

      const order = new orderModel({
        course_id : course_id,
        user_id : req.user._id,
        payment_mode : mode_of_payment,
        date_of_purchase : purchase_date,
        amount : amount
      })
      await order.save()
      .then(() => {
        res.status(200).json({ message: 'Payment success' });
      })
      .catch((error) => {
        console.error(error); 
        res.status(500).json({ message: 'Saving order failed' });
      });
    }else{
      console.log('invalid signature');
      res.json({status:false, message:'Invalid signature'})
    }
  }catch(error){
    console.log(error);
    res.status(500).json({message:'Server Failed'})
  }
}



module.exports = {
  getOrderLists,
  getOrderData,
  paymentModeHandle,
  paymentStatusHandle,
  cancelOrder,
  verifyrzpay,
}