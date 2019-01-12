import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const StoreList = () => import('../components/system/Store.vue')
const Layout = () => import('../components/common/Layout.vue')
const Home = () => import('../components/common/Home.vue')
const Sys = () => import('../components/system/User.vue')
const Role = () => import('../components/system/Role.vue')
const Warehouse = () => import('../components/system/Warehouse.vue')
const Address = () => import('../components/system/Address.vue')
const Supplier = () => import('../components/system/Supplier.vue')
const Material = () => import('../components/system/Material.vue')
const Class = () => import('../components/system/Class.vue')
const Inventory = () => import('../components/manager/Inventory.vue')
const Goods = () => import('../components/system/Goods.vue')
const Stock = () => import('../components/manager/Stock.vue')
const Order = () => import('../components/purchase/Order.vue')
const Apply = () => import('../components/purchase/Apply.vue')
const Choose = () => import('../components/purchase/Choose.vue')
const Finance = () => import('../components/purchase/Finance.vue')
const Boss = () => import('../components/purchase/Boss.vue')
const Receive = () => import('../components/purchase/Receive.vue')
const ReApply = () => import('../components/purchase/ReApply.vue')
const ReCheck = () => import('../components/purchase/ReCheck.vue')
const ReFinance = () => import('../components/purchase/ReFinance.vue')
const WareStock= () => import('../components/warehouse/WareStock.vue')
const WareInventory= () => import('../components/warehouse/WareInventory.vue')
const ReGoods= () => import('../components/purchase/ReGoods.vue')
const ReMoney= () => import('../components/purchase/ReMoney.vue')
const ReturnOrder= () => import('../components/purchase/ReturnOrder.vue')
const OrReturnOrder= () => import('../components/manager/ReturnOrder.vue')
const Discard= () => import('../components/manager/Discard.vue')
const StoreReturn= () => import('../components/logistics/StoreReturn.vue')
const StoreDiscard= () => import('../components/logistics/StoreDiscard.vue')
const CommodityMaterial= () => import('../components/manager/CommodityMaterial.vue')
const OrderList= () => import('../components/manager/OrderList.vue')
const CommodityOrder= () => import('../components/manager/CommodityOrder.vue')
const MaterialOrder= () => import('../components/manager/MaterialOrder.vue')
const WeekOrder= () => import('../components/manager/WeekOrder.vue')
const MonthOrder= () => import('../components/manager/MonthOrder.vue')
const UrgentOrder= () => import('../components/manager/UrgentOrder.vue')
const StoreOrder= () => import('../components/logistics/StoreOrder.vue')
const OutboundOrder= () => import('../components/logistics/OutboundOrder.vue')
const MoveOrder= () => import('../components/logistics/MoveOrder.vue')
const wareOutboundOrder= () => import('../components/warehouse/OutboundOrder.vue')
const Login= () => import('../components/common/Login.vue')
const OrderStatistics= () => import('../components/reportForm/OrderStatistics.vue')
const ReturnStatistics= () => import('../components/reportForm/ReturnStatistics.vue')
const ScrapStatistics= () => import('../components/reportForm/ScrapStatistics.vue')
const StoreOrderReport= () => import('../components/reportForm/StoreOrder.vue')
const materialOrderReport= () => import('../components/reportForm/MaterialOrder.vue')
const StoreReturnReport= () => import('../components/reportForm/StoreReturn.vue')
const MaterialOrderReport= () => import('../components/reportForm/MaterialReturn.vue')
const StoreScrap= () => import('../components/reportForm/StoreScrap.vue')
const MaterialScrap= () => import('../components/reportForm/MaterialScrap.vue')
const SupplierReport= () => import('../components/reportForm/SupplySum.vue')
const MaterialReport= () => import('../components/reportForm/MaterialSum.vue')
const inputWarehouse= () => import('../components/warehouse/InputWarehouse.vue')
const WarehouseScrap= () => import('../components/logistics/WarehouseScrap.vue')
const WarehouseOrderScrap= () => import('../components/warehouse/Scrap.vue')
const LogWarehouseMaterialScrap= () => import('../components/reportForm/LogWarehouseMaterialScrap.vue')
const LogWarehouseScrap= () => import('../components/reportForm/LogWarehouseScrap.vue')
const WareWarehouseScrap= () => import('../components/reportForm/WarehouseScrap.vue')


export default new Router({
  routes: [{
      path: '/',
      name: '系统管理',
      component: Layout,
      redirect: '/home',
      children: [{
        path: 'home',
        name: "首页",
        component: Home
      }]
    },{
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/sys_setting',
      name: '系统管理',
      component: Layout,
      redirect: '/sys_setting/role_list',
      children: [{
        path: 'role_list',
        name: '角色管理',
        component: Role
      }, {
        path: 'user_list',
        name: '用户管理',
        component: Sys
      }, {
        path: 'address',
        name: '地址管理',
        component: Address
      }, {
        path: 'catalog',
        name: '分类管理',
        component: Class
      }, {
        path: 'supplier',
        name: '供应商管理',
        component: Supplier
      }, {
        path: 'sys_warehouse',
        name: '仓库管理',
        component: Warehouse
      }, {
        path: 'material',
        name: '原料管理',
        component: Material
      }, {
        path: 'product',
        name: '商品管理',
        component: Goods
      }, {
        path: 'formulation',
        name: '配方管理',
        component: Home
      }, {
        path: 'store_list',
        name: '门店列表',
        component: StoreList
      }, {
        path: 'store_quick_create',
        name: '快速建店',
        component: Home
      }]
    },{
      path: '/s_store',
      name: '店长管理',
      component: Layout,
      redirect: '/s_store/order',
      children:[{
        path: 'order',
        name: '订货单',
        component: OrderList
      },{
        path: 'product_order',
        name: '商品订货',
        component: CommodityOrder
      },{
        path: 'product_material_order',
        name: '商品原料订货',
        component: CommodityMaterial
      },{
        path: 'material_order',
        name: '原料订货',
        component: MaterialOrder
      },,{
        path: 'week_order',
        name: '周订单',
        component: WeekOrder
      },{
        path: 'month_order',
        name: '月订单',
        component: MonthOrder
      },,{
        path: 'urgent_order',
        name: '紧急订单',
        component: UrgentOrder
      },{
        path: 'return',
        name: '退货单',
        component: OrReturnOrder
      },{
        path: 'scrap',
        name: '废弃单',
        component: Discard
      },{
        path: 'stock',
        name: '库存',
        component: Stock
      },{
        path: 'count',
        name: '盘点',
        component: Inventory
      }]
    },{
      path: '/logistics',
      name: '物流管理',
      component: Layout,
      redirect: '/logistics/store_order',
      children:[{
        path: 'store_order',
        name: '门店订货单',
        component: StoreOrder
      },{
        path: 'store_return',
        name: '门店退货单',
        component: StoreReturn
      },{
        path: 'store_scrap',
        name: '门店废弃单',
        component: StoreDiscard
      },{
        path: 'out_order',
        name: '出库单',
        component: OutboundOrder
      },{
        path: 'move_order',
        name: '移库单',
        component: MoveOrder
      },{
        path: 'store_reconciliation',
        name: '门店对账',
        component: Home
      },{
        path: 'Warehouse_scrap',
        name: '仓库废弃',
        component: WarehouseScrap
      }]
    },{
      path:'/warehouse',
      name:'仓库管理',
      component:Layout,
      redirect:'/warehouse/out_order',
      children:[{
        path:'out_order',
        name:'出库单',
        component: wareOutboundOrder
      },{
        path:'scrap',
        name:'废弃单',
        component: WarehouseOrderScrap
      },{
        path:'stock',
        name:'库存',
        component: WareStock
      },{
        path:'count',
        name:'盘点',
        component: WareInventory
      },{
        path:'stock_in',
        name:'入库',
        component: inputWarehouse
      }]
    },{
      path:'/purchase',
      name:'采购管理',
      component:Layout,
      redirect:'/purchase/order_list',
      children:[{
        path:'order_list',
        name:'采购订单',
        component:Order
      },{
        path:'order_apply',
        name:'采购申请',
        component:Apply
      },{
        path:'choose_supplier',
        name:'选择供应商',
        component:Choose
      },{
        path:'finance_subject',
        name:'财务审批',
        component:Finance
      },{
        path:'boss_subject',
        name:'BOSS审批',
        component:Boss
      },{
        path:'in_warehouse',
        name:'采购入库',
        component:Receive
      },{
        path:'return_order_list',
        name:'退货单列表',
        component:ReturnOrder
      },{
        path:'return_apply',
        name:'退货申请',
        component:ReApply
      },{
        path:'return_subject',
        name:'采购审核',
        component:ReCheck
      },{
        path:'finance_review',
        name:'财务审批',
        component:ReFinance
      },{
        path:'p_logistics_delivery',
        name:'物流发货',
        component:ReGoods
      },{
        path:'finance_getmoney',
        name:'财务收款',
        component:ReMoney
      }]
    },{
      path:'/report',
      name:'报表管理',
      component:Layout,
      redirect:'/report/order_report',
      children:[{
        path:'order_report',
        name:'订货统计',
        component:OrderStatistics
      },{
        path:'return_report',
        name:'退货统计',
        component:ReturnStatistics
      },{
        path:'scrap_report',
        name:'废弃统计',
        component:ScrapStatistics
      },{
        path:'LogisticsStoreOrder',
        name:'门店订货',
        component:StoreOrderReport
      },{
        path:'Logistics_material_order',
        name:'原料发货',
        component:materialOrderReport
      },{
        path:'LogisticsStoreReturn',
        name:'门店退货',
        component:StoreReturnReport
      },{
        path:'Logistics_material_return',
        name:'原料退货',
        component:MaterialOrderReport
      },{
        path:'LogisticsStoreScrap',
        name:'门店废弃',
        component:StoreScrap
      },{
        path:'Logistics_material_scrap',
        name:'原料废弃',
        component:MaterialScrap
      },{
        path:'LWareHouseScrap',
        name:'仓库废弃',
        component:LogWarehouseScrap
      },{
        path:'LWHMScrap',
        name:'仓库原料废弃',
        component:LogWarehouseMaterialScrap
      },{
        path:'PurchaseSupplier_report',
        name:'供应商统计',
        component:SupplierReport
      },{
        path:'Purchase_material_report',
        name:'原料统计',
        component:MaterialReport
      },{
        path:'WHScrap',
        name:'仓库废弃',
        component:WareWarehouseScrap
      }]
    }
  ]
})
