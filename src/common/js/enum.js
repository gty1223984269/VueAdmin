var orderStatus = {
    //新建
    new : 0,
    //已支付
    paid : 1,
    //已送货
    delivered : 2,
    //已完成
    complete:3,
    //已取消
    cancel:4,
    //已退款
    refund:5
}
var payStatus={
    none:0,
    paid:1
}
let enumJS=
{
orderStatus,
payStatus,
}
export default enumJS