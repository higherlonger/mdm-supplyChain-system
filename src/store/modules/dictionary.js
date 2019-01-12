import {
  dictionary,
  getWarehouseTree,
  nextHandlePeo,
  getStoreCity,
  roleData,
  getLimitList,
  getCagTree,
  getSecondTree,
  getInvenTree,
  getGoodsUnit,
  getStockList,
  getLogistics,
  getMaterialUnit,
  getOneTree,
  getGoodsTree,
  getParentProcucts,
  getAllStore,
  getMoveOrderTree,
  getMaterialList,
  getInputWarehouseTree,
  getList
} from '../../api'
import common from '../../assets/js/common';
const state = {
  //系统管理-门店管理-门店列表-门店状态
  store_state: [],
  //所在城市
  cityList: [],
  //所在省份
  provinceList: [],
  //获取角色下拉条
  roleList: [],
  //获取角色权限列表
  limitList: [],
  //仓库列表
  wareHouse: [],
  //商品管理-原料类型
  material: [],
  //原料管理-分类树
  typeTree: [],
  //原料管理-二级分类树
  secondTree: [],
  //原料管理-获取存储条件
  storeCondition: [],
  //原料管理-订单类型
  orderType: [],
  //原料管理-采购类型
  purchase: [],
  //商品分类树
  commodityList: [],
  //盘点-分类树
  inventoryTree: [],
  //商品管理-获取商品单位
  productUnit: [],
  //退货申请-库存数
  stockTree: [],
  //采购-下一处理人
  nextHandlePeo: [],
  //采购-采购单状态
  returnOrderType: [],
  //采购流程-下一联系人名字列表
  returnOrderName: {
    "wuliu": "物流",
    "caigou": '采购员',
    "caiwu": '财务',
    "boss": 'boss',
    "purchase":'purchase',
    "finance":'finance',
    "warehouse":'warehouse'
  },
  //采购流程-查询流程记录-参数名
  queryProcessName:{
    "wuliu":'logistics_clearance',
    "caigou":'purchase_audit',
    "caiwu":'finance_confirm',
    "fahuo":'logistics_delivery',
    "tuihuoC":'return_shutdown',
    "tuihuoF":'return_finish'
  },
  //店长-退货单状态
  returnOrderState:[],
  //仓库-库存下拉条
  stockList:[],
  //门店列表
  storeList:[], 
  //店长-废弃单状态
  discardList:[],
  //原料-保质期单位
  lifeUnit:[],
  //原料-原材料单位
  materialUnit:[],
  //一级分类树
  getOneTree:[],
  //商品类型
  productType:[],
  //父级商品
  parentProduct:[],
  //商品分类树
  getGoodsTree:[],
  //订单状态
  orderStates:[],
  //dayTree
  dayTree:[],
  //weekTree
  weekTree:[],
  //monthTree
  monthTree:[],
  //所有门店
  allStore:[],
  //移库单的树
  moveOrderTree:[],
  //原料下拉条列表
  materialList:[],
  //入库-树
  inputWarehouseTree:[],
  //原料下拉条
  materialListAry:[],
  //商品下拉条
  commodityListAry:[],
  //出库单状态下拉条
  outOrderList:[]
}

const actions = {
  async getStoreState({
    state,
    commit
  }, params) {
    if (state.store_state.length) return;
    const response = await dictionary({
      dict: 'state'
    });
    commit({
      type: 'storeState',
      data: response.data || []
    })
  },
  async getCityList({
    state,
    commit
  }, params) {
    if (state.cityList.length) return;
    const response = await getStoreCity({
      keyword: 'city'
    })
    commit({
      type: 'cityList',
      data: response.data || []
    })
  },
  async getProvinceList({
    state,
    commit
  }, params) {
    if (state.provinceList.length) return;
    const response = await getStoreCity({
      keyword: 'province'
    })
    commit({
      type: 'provinceList',
      data: response.data || []
    })
  },
  async getRoleList({
    state,
    commit
  }, params) {
    if (state.roleList.length) return;
    const response = await roleData();
    commit({
      type: 'roleList',
      data: response.data || []
    })
  },
  async getLimitList({
    state,
    commit
  }, params) {
    if (state.limitList.length) return;
    const response = await getLimitList();
    commit({
      type: 'limitList',
      data: response.data || []
    })
  },
  async getWareHouse({
    state,
    commit
  }, params) {
    if (state.limitList.length) return;
    const response = await dictionary({
      dict: 'warehouse_type'
    });
    commit({
      type: 'wareHouse',
      data: response.data || []
    })
  },
  async getMaterial({
    state,
    commit
  }, params) {
    if (state.material.length) return;
    const response = await dictionary({
      dict: 'purchase_type'
    });
    commit({
      type: 'material',
      data: response.data || []
    })
  },
  async getTypeTree({
    state,
    commit
  }, params) {
    if (state.typeTree.length) return;
    const response = await getCagTree({
      type: 'material'
    });
    commit({
      type: 'typeTree',
      data: response.data.children || []
    })
  },
  async getSecondTree({
    state,
    commit
  }, params) {
    if (state.secondTree.length) return;
    const response = await getSecondTree({
      type: 'material'
    });
    commit({
      type: 'secondTree',
      data: response.data || []
    })
  },
  async getStoreCondition({
    state,
    commit
  }, params) {
    if (state.storeCondition.length) return;
    const response = await dictionary({
      dict: 'storage_condition'
    });
    commit({
      type: 'storeCondition',
      data: response.data || []
    })
  },
  async getOrderType({
    state,
    commit
  }, params) {
    if (state.orderType.length) return;
    const response = await dictionary({
      dict: 'order_type'
    });
    commit({
      type: 'orderType',
      data: response.data || []
    })
  },
  async getPurchase({
    state,
    commit
  }, params) {
    if (state.purchase.length) return;
    const response = await dictionary({
      dict: 'purchase_type'
    });
    commit({
      type: 'purchase',
      data: response.data || []
    })
  },
  async getReturnOrderType({
    state,
    commit
  }, params) {
    if (state.purchase.length) return;
    const response = await dictionary({
      dict: 'purchase_order_type'
    });
    commit({
      type: 'returnOrderType',
      data: response.data || []
    })
  },
  async getCommodityList({
    state,
    commit
  }, params) {
    if (state.commodityList.length) return;
    const response = await getSecondTree({
      type: 'product'
    });
    commit({
      type: 'commodityList', 
      data: response.data || []
    })
  }, 
  async getInventoryTree({
    state,
    commit
  }, params) {
    if (state.inventoryTree.length) return;
    const response = await getInvenTree();
    commit({
      type: 'inventoryTree',
      data: response.data.children || []
    })
  },
  async getDayTree({
    state,
    commit
  }, params) {
    if (state.dayTree.length) return;
    const response = await getInvenTree({
      order_type:'day'
    });
    commit({
      type: 'dayTree',
      data: response.data.children || []
    })
  },
  async getWeekTree({
    state,
    commit
  }, params) {
    if (state.weekTree.length) return;
    const response = await getInvenTree({
      order_type:'week'
    });
    commit({
      type: 'weekTree',
      data: response.data.children || []
    })
  },
  async getMonthTree({
    state,
    commit
  }, params) {
    if (state.monthTree.length) return;
    const response = await getInvenTree({
      order_type:'month'
    });
    commit({
      type: 'monthTree',
      data: response.data.children || []
    })
  },
  async getProductUnit({
    state,
    commit
  }, params) {
    if (state.productUnit.length) return;
    const response = await getGoodsUnit();
    commit({
      type: 'productUnit',
      data: response.data || []
    })
  },
  async getStockTree({
    state,
    commit
  }, params) {
    if (state.stockTree.length) return;
    const response = await getWarehouseTree();
    commit({
      type: 'stockTree',
      data: response.data.children || []
    })
  },
  async getNextHandlePeo({
    state,
    commit
  }, params) {
    const response = await nextHandlePeo({
      name: params
    });
    commit({
      type: 'nextHandlePeo',
      data: response.data || []
    })
  },
  async getReturnOrderState({
    state,
    commit
  }, params) {
    const response = await dictionary({
      dict: 'store_return_type'
    });
    commit({
      type: 'returnOrderState',
      data: response.data || []
    })
  },
  async getStockList({
    state,
    commit
  }, params) {
    const response = await getStockList();
    commit({
      type: 'stockList',
      data: response.data || []
    })
  },
  async getStoreList({
    state,
    commit
  }, params) {
    const response = await getLogistics();
    commit({
      type: 'storeList',
      data: response.data || []
    })
  },
  async getDiscardList({
    state,
    commit
  }, params) {
    const response = await dictionary({
      dict: 'store_scrap_state'
    });
    commit({
      type: 'discardList',
      data: response.data || []
    })
  },
  async getLifeUnit({
    state,
    commit
  }, params) {
    const response = await dictionary({
      dict: 'shelf_life_unit'
    });
    commit({
      type: 'lifeUnit',
      data: response.data || []
    })
  },
  async getMaterialUnit({
    state,
    commit
  }, params) {
    const response = await getMaterialUnit();
    commit({
      type: 'materialUnit',
      data: response.data || []
    })
  },
  async getOneTreeList({
    state,
    commit
  }, params) {
    const response = await getOneTree({
      type: 'material'
    });
    commit({
      type: 'getOneTree',
      data: response.data || []
    })
  },
  async getProductType({
    state,
    commit
  }, params) {
    const response = await dictionary({
      dict: 'product_type'
    });
    commit({
      type: 'productType',
      data: response.data || []
    })
  },
  async getParentProducts({
    state,
    commit
  }, params) {
    const response = await getParentProcucts();
    commit({
      type: 'parentProduct',
      data: response.data || []
    })
  },
  async getGoodsTreeList({
    state,
    commit
  }, params) {
    const response = await getGoodsTree();
    commit({
      type: 'getGoodsTree',
      data: response.data || []
    })
  },
  async getOrderStates({
    state,
    commit
  }, params) {
    const response = await dictionary({
      dict:'store_order_type'
    });
    commit({
      type: 'orderStates',
      data: response.data || []
    })
  },
  async getAllStore({
    state,
    commit
  }, params) {
    const response = await getAllStore();
    commit({
      type: 'allStore',
      data: response.data || []
    })
  },
  async getMoveOrder({
    state,
    commit
  }, params) {
    const response = await getMoveOrderTree();
    commit({
      type: 'moveOrderTree',
      data: response.data || []
    })
  },
  async getMaterialList({
    state,
    commit
  }, params) {
    const response = await getMaterialList();
    commit({
      type: 'materialList',
      data: response.data || []
    })
  },
  async getInputWarehouseTree({
    state,
    commit
  }, params) {
    const response = await getInputWarehouseTree();
    commit({
      type: 'inputWarehouseTree',
      data: response.data || []
    })
  },
  async getMaterialListMatAry({
    state,
    commit
  }, params) {
    const response = await getList({
      type:'material'
    });
    commit({
      type: 'materialListAry',
      data: response.data || []
    })
  },
  async getMaterialListComAry({
    state,
    commit
  }, params) {
    const response = await getList({
      type:'product'
    });
    commit({
      type: 'commodityListAry',
      data: response.data || []
    })
  },
  async getOutOrderList({
    state,
    commit
  }, params) {
    if (state.store_state.length) return;
    const response = await dictionary({
      dict: 'warehouse_out_order'
    });
    commit({
      type: 'outOrderList',
      data: response.data || []
    })
  }
}

const mutations = {
  storeState(state, {
    data
  }) {
    state.store_state = data;
  },
  cityList(state, {
    data
  }) {
    state.cityList = data;
  },
  provinceList(state, {
    data
  }) {
    state.provinceList = data;
  },
  roleList(state, {
    data
  }) {
    state.roleList = data;
  },
  limitList(state, {
    data
  }) {
    state.limitList = data;
  },
  wareHouse(state, {
    data
  }) {
    state.wareHouse = data;
  },
  material(state, {
    data
  }) {
    state.material = data;
  },
  typeTree(state, {
    data
  }) {
    state.typeTree = data;
  },
  secondTree(state, {
    data
  }) {
    state.secondTree = data;
  },
  storeCondition(state, {
    data
  }) {
    state.storeCondition = data;
  },
  orderType(state, {
    data
  }) {
    state.orderType = data;
  },
  purchase(state, {
    data
  }) {
    state.purchase = data;
  },
  commodityList(state, {
    data
  }) {
    state.commodityList = data;
  },
  inventoryTree(state, {
    data
  }) {
    state.inventoryTree = data;
  },
  productUnit(state, {
    data
  }) {
    state.productUnit = data;
  },
  stockTree(state, {
    data
  }) {
    state.stockTree = data;
  },
  nextHandlePeo(state, {
    data
  }) {
    state.nextHandlePeo = data;
  },
  returnOrderType(state, {
    data
  }) {
    state.returnOrderType = data;
  },
  returnOrderState(state, {
    data
  }) {
    state.returnOrderState = data;
  },
  stockList(state, {
    data
  }) {
    state.stockList = data;
  },
  storeList(state, {
    data
  }) {
    state.storeList = data;
  },
  discardList(state, {
    data
  }) {
    state.discardList = data;
  },
  lifeUnit(state,{
    data
  }){
    state.lifeUnit = data;
  },
  materialUnit(state,{
    data
  }){
    state.materialUnit = data;
  },
  getOneTree(state,{
    data
  }){
    state.getOneTree = data;
  },
  productType(state,{
    data
  }){
    state.productType = data;
  },
  parentProduct(state,{
    data
  }){
    state.parentProduct = data;
  },
  getGoodsTree(state,{
    data
  }){
    state.getGoodsTree = data;
  },
  orderStates(state,{
    data
  }){
    state.orderStates = data;
  },
  dayTree(state,{
    data
  }){
    state.dayTree = data;
  },
  weekTree(state,{
    data
  }){
    state.weekTree = data;
  },
  monthTree(state,{
    data
  }){
    state.monthTree = data;
  },
  allStore(state,{
    data
  }){
    state.allStore = data;
  },
  moveOrderTree(state,{
    data
  }){
    state.moveOrderTree = data;
  },
  materialList(state,{
    data
  }){
    state.materialList = data;
  },
  inputWarehouseTree(state,{
    data
  }){
    state.inputWarehouseTree=data;
  },
  materialListAry(state,{
    data
  }){
    state.materialListAry=data;
  },
  commodityListAry(state,{
    data
  }){
    state.commodityListAry=data;
  },
  outOrderList(state,{
    data
  }){
    state.outOrderList=data;
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
