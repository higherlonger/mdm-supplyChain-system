import {instance,serverUrl} from './fetch'

/* 共用 */
//获取导航 
export const getNavList=()=>instance.get('sysMenuCtrl')
//字典值
export const dictionary=params=>instance.get('dictionaryCtrl/getDict',{params})
//登录
export const login=params=>instance.get('http://localhost:8080/loginCtrl',{params})
//废弃单-获取token
export const getScrapToken=params=>instance.post('http://localhost:8080/quniuCtrl/getToken',params)
//个人设置
export const personset=params=>instance.get('sysUserCtrl/showMyDetail',{params})
//提交修改
export const updatePerson=params=>instance.get('sysUserCtrl/updateById',{params})
//退出登录
export const outLogin=params=>instance.get('sysUserCtrl/loginout',{params})

/* 系统管理-门店管理 */
//门店列表-获取门店列表
export const getStoreList=params=>instance.get('storeCtrl/query',{params})
//门店列表-获取所在城市
export const getStoreCity=params=>instance.get('addressCtrl/queryCityOrProvince',{params})
//门店列表-根据id查询门店信息
export const getStoreById=params=>instance.get('storeCtrl/showById',{params})
//门店列表-修改门店信息
export const EditStoreInfo=params=>instance.post('storeCtrl/updateById',params)
//门店列表-新增门店
export const addStore=params=>instance.get('storeCtrl/add',{params})
//门店列表-停用门店
export const stopStore=params=>instance.get('storeCtrl/updateState',{params})
//门店列表-关联商品
export const relationGoods=params=>instance.post('storeProductRelationCtrl/createStoreProductRelation',params)
//门店列表-确认快速建店
export const configQuickStore=params=>instance.post('storeCtrl/quickCreateStore',params)


/* 系统管理-系统设置 */
//用户管理-获取用户列表
export const getUserList=params=>instance.get('sysUserCtrl/query',{params})
//用户管理-新增用户
export const addUser=params=>instance.get('sysUserCtrl/add',{params})
//用户管理-获取角色下拉数据
export const roleData=params=>instance.get('sysRolesCtrl/getRoleDict',{params})
//用户管理-根据id查用户信息
export const getInfoById=params=>instance.get('sysUserCtrl/showById',{params})
//用户管理-修改用户
export const editUser=params=>instance.get('sysUserCtrl/updateById',{params})
//用户管理-停用/启用 用户
export const stopUser=params=>instance.get('sysUserCtrl/updateState',{params})
//角色管理-获取角色列表
export const getRoleList=params=>instance.get('sysRolesCtrl/list',{params})
//角色管理-获取权限列表
export const getLimitList=params=>instance.get('sysMenuCtrl',{params})
//角色管理-根据id查询详细信息
export const getDetailById=params=>instance.get('sysRolesCtrl/showById',{params})
//角色管理-修改
export const editRole=params=>instance.get('sysRolesCtrl/updateById',{params})
//角色管理-新增
export const addRole=params=>instance.get('sysRolesCtrl/add',{params})
//角色管理-停用/启用 角色
export const stopRole=params=>instance.get('sysRolesCtrl/updateState',{params})


/* 系统管理-基础管理 */
//仓库管理-获取仓库列表
export const getWarehouse=params=>instance.get('warehouseCtrl/query',{params})
//仓库管理-根据id获取仓库信息
export const getWhDetail=params=>instance.get('warehouseCtrl/showById',{params})
//仓库管理-修改仓库信息
export const editWarehouse=params=>instance.get('warehouseCtrl/updateById',{params})
//仓库管理-新增仓库
export const addWarehouse=params=>instance.get('warehouseCtrl/add',{params})
//仓库管理-停用/启用
export const stopWarehouse=params=>instance.get('warehouseCtrl/updateState',{params})
//地址管理-查列表
export const getAddressList=params=>instance.get('addressCtrl/query',{params})
//地址管理-根据id查询
export const getAdById=params=>instance.get('addressCtrl/showById',{params})
//地址管理-修改地址
export const editAddress=params=>instance.get('addressCtrl/updateById',{params})
//地址管理-新增地址
export const addAddress=params=>instance.get('addressCtrl/add',{params})
//地址管理-停用
export const stopAddress=params=>instance.get('addressCtrl/updateState',{params})
//供应商管理-获取列表
export const getSuppList=params=>instance.get('supplierCtrl/query',{params})
//供应商管理-根据id获取信息
export const getSuppById=params=>instance.get('supplierCtrl/showById',{params})
//供应商管理-新增供应商
export const addSupp=params=>instance.post('supplierCtrl/add',params)
//供应商管理-修改供应商
export const editSupp=params=>instance.post('supplierCtrl/updateById',params)
//分类管理-修改分类
export const editClass=params=>instance.post('catalogCtrl/updateById',params)
//分类管理-删除分类
export const delClass=params=>instance.get('catalogCtrl/deleteByIds',{params})
//分类管理-新增分类
export const addCatalog=params=>instance.get('catalogCtrl/add',{params})


/* 系统管理-商品管理 */
//原料管理-原料下拉条列表
export const getList=params=>instance.get('catalogCtrl/getCatalogNameIdTree',{params})
//原料管理-列表查询
export const getMaterList=params=>instance.get('materialCtrl/query',{params})
//原料管理-分类树
export const getCagTree=params=>instance.get('catalogCtrl/queryCategoryTree',{params})
//原料管理-二级分类树
export const getSecondTree=params=>instance.get('catalogCtrl/getLevel2CatalogList',{params})
//原料管理-一级分类树
export const getOneTree=params=>instance.get('catalogCtrl/getLevel1CatalogList',{params})
//原料管理-新增原料
export const addMater=params=>instance.get('materialCtrl/add',{params})
//原料管理-修改原料
export const editMater=params=>instance.get('materialCtrl/updateById',{params})
//原料管理-停用、启用
export const stopMarters=params=>instance.get('materialCtrl/updateState',{params})
//商品管理-获取分类树
export const getGoodsTree=params=>instance.get('productCtrl/getProductTree',{params})
//商品管理-获取商品单位
export const getGoodsUnit=params=>instance.get('productCtrl/getProductUnit',{params})
//商品管理-新增商品
export const addGoods=params=>instance.get('productCtrl/add',{params})
//商品管理-获取只有商品的分类树
export const getOnlyGoodsTree=params=>instance.get('productCtrl/getProductNoCatalogTree',{params})
//商品管理-获取原材料的单位
export const getMaterialUnit=params=>instance.get('materialCtrl/getMaterialUnit',{params})
//商品管理-获取父级商品
export const getParentProcucts=params=>instance.get('productCtrl/getAllParentProduct',{params})
//商品管理-获取商品配方
export const getFormulaById=params=>instance.get('productCtrl/showById',{params})
//修改bom
export const editBom=params=>instance.post('productCtrl/updateBom',params)
//修改bom
export const editCommodity=params=>instance.post('productCtrl/updateById',params)



/* 店长管理-库存管理 */
//盘点-获取分类树
export const getInvenTree=params=>instance.get('materialCtrl/getMaterialTree',{params})
//盘点-获取盘点记录
export const getInvenList=params=>instance.get('storeCountCtrl/query',{params})
//盘点-获取盘点列表
export const getInvenDataList=params=>instance.get('storeStockCtrl/list',{params})
//盘点-新增盘点
export const addInven=params=>instance.post('storeCountCtrl/add',params)
//盘点-下载模板
export const downloadStock=params=>instance.post('warehouseCountCtrl/countByXlsTemplate',params)
//盘点-导入xls
export const downloadXls=params=>instance.post('warehouseCountCtrl/countByXls',params)


/* 店长管理-库存管理 */
//订单管理-获取退货单列表
export const getReturnOrdersList=params=>instance.get('orderReturnCtrl/query',{params})
//订单管理-店长撤销
export const closeReturnOrdersList=params=>instance.get('orderReturnCtrl/revokeOrder',{params})
//订单管理-撤销废弃单
export const closeDiscardOrdersList=params=>instance.get('orderScrapCtrl/revokeOrder',{params})
//订单管理-获取废弃单列表
export const getDiscardList=params=>instance.get('orderScrapCtrl/query',{params})
//订单管理-获取仓库废弃列表
export const getWarehouseDiscardList=params=>instance.get('warehouseScrapCtrl/query',{params})


/* 店长管理-订单管理 */
//提交商品订货单
export const commitOrder=params=>instance.post('orderCtrl/createProductOrder',params)
//商品订货单-完成
export const submitOrder=params=>instance.post('orderCtrl/saveOutOrder',params)
//提交商品订货单
export const commitMaterialOrder=params=>instance.post('orderCtrl/createMaterialOrder',params)
export const commitMaterialOrder2=params=>instance.post('orderCtrl/createProductOrderNext',params)
//查询订单列表
export const getCommodityList =params=>instance.post('orderCtrl/query',params)
//撤销订单
export const cancelOrder =params=>instance.post('orderCtrl/storeRevocation',params)
//接收入库
export const receiveOrder =params=>instance.post('orderCtrl/storeReceived',params)
//下载商品订货模板
export const downloadCommodityExp =params=>instance.post('orderCtrl/downProductOrderTemplate',params)
//下载商品订货模板
export const downloadMaterialExp =params=>instance.post('orderCtrl/downMaterialOrderTemplate',params)


/* 采购管理-采购单 */
//采购订单-回显
export const getOrderList=params=>instance.get('purchaseOrderCtrl/query',{params})
//采购订单-根据id查看详情
export const getOrderById=params=>instance.get('purchaseOrderCtrl/showPurchaseOrderById',{params})
//采购申请-新增
export const addApply=params=>instance.post('purchaseOrderCtrl/add',params)
//采购申请-订单回显
export const getApplyList=params=>instance.get('purchaseOrderCtrl/query',{params})
//采购申请-引单新建-根据id查询信息
export const getApplyById=params=>instance.get('purchaseOrderCtrl/queryFromPurchaseOrder',{params})
//选择供应商-查提供原料的供应商
export const getSuppInfo=params=>instance.post('supplierCtrl/querySupplierForMaterial',params)
//财务，Boss，采购，入库
export const getSuppSecInfo=params=>instance.get('purchasePurchasereturnProcessCtrl/query',{params})
//更新采购流程
export const updateProcess=params=>instance.post('purchasePurchasereturnProcessCtrl/updateById',params)
//关闭采购订单
export const closeProcess=params=>instance.post('purchaseOrderCtrl/shutdown',params)
//直接完成
export const allFinish=params=>instance.post('purchaseOrderCtrl/finish',params)


/* 采购管理-采购退货 */
//获取退货单
export const getReturnList=params=>instance.get('purchaseReturnCtrl/query',{params})
//新增退货单-第一步
export const addReturnList=params=>instance.post('purchaseReturnCtrl/batchSave',params)
//采购-下一处理人
export const nextHandlePeo=params=>instance.get('sysUserCtrl/getToUsers',{params})
//退货-填写退货单-第二步
export const addReturnListSec=params=>instance.post('purchasePurchasereturnProcessCtrl/updateReturnProcess',params)
//退货-获取退货单流程列表
export const getReturnProcess=params=>instance.post('purchasePurchasereturnProcessCtrl/query',params)
//退货-关闭
export const closeReturnProcess=params=>instance.get('purchaseReturnCtrl/shutdown',{params})
//退货-流程日志
export const closeProcessWord=params=>instance.get('purchaseReturnCtrl/showPurchaseReturnOrderById',{params})


/* 仓库管理-库存管理 */
//盘点-获取树
export const getWarehouseTree=params=>instance.get('warehouseStockCtrl/getStockTree',{params})
//盘点-提交盘点
export const addWarehouseTree=params=>instance.post('warehouseCountCtrl/add',params)
//盘点-获取记录列表
export const getWarehouseList=params=>instance.get('warehouseStockCtrl/query',{params})
//盘点-库存下拉条
export const getStockList=params=>instance.get('warehouseStockCtrl/queryMaterialNameIds',{params})
//盘点-盘点记录
export const getPreStockList=params=>instance.get('warehouseCountCtrl/query',{params})
//盘点-新增库存
export const addStockSec=params=>instance.post('warehouseStockCtrl/add',params)
//盘点-查询入库列表
export const getInputWarehouseList=params=>instance.post('warehouseInCtrl/query',params)
//盘点-查询入库树列表
export const getInputWarehouseTree=params=>instance.post('warehouseInCtrl/getWarehouseInMaterialTree',params)
//盘点-完成入库
export const addInputWarehouseTree=params=>instance.post('warehouseInCtrl/add',params)
//订单管理-提交废弃单
export const submitScrapOrder=params=>instance.post('warehouseScrapCtrl/add',params)

//盘点-导入xls
export const downloadWarehouseXls=params=>instance.post('warehouseCountCtrl/countByXls',params)

     

/* 物流管理-订单管理 */
//门店退货单-获取列表
export const getLogistics=params=>instance.get('storeCtrl/queryStores',{params})
//门店退货单-点击查看-详情
export const getLogisticsById=params=>instance.post('warehouseStockCtrl/queryBatchNumList',params)
//门店退货单-接收
export const receiveLogistics=params=>instance.post('orderReturnCtrl/acceptReturnItems',params)
//门店废弃单-接收
export const discardLogistics=params=>instance.post('orderScrapCtrl/acceptScrapItems',params)
//门店退货单-完成
export const finishLogistics=params=>instance.post('orderReturnCtrl/finishOrder',params)
//门店废弃单-完成
export const discardFinishLogistics=params=>instance.post('orderScrapCtrl/finishOrder',params)
//门店退货单-退回
export const returnLogistics=params=>instance.post('orderReturnCtrl/returnOrder',params)
//门店退货单-退回
export const discardReturnLogistics=params=>instance.post('orderScrapCtrl/returnOrder',params)
//门店订货单-驳回
export const discardReturnOrder=params=>instance.post('orderCtrl/logisticsOverrule',params)
//门店订货单-出库
export const agreeOrder=params=>instance.post('orderCtrl/logisticsReceived',params)
//门店订货单-生成出库单-获取
export const getOutOrderInfo=params=>instance.post('orderCtrl/createOutOrder',params)
//获取所有门店 
export const getAllStore=params=>instance.post('warehouseOutOrderCtrl/query',params)
//移库单-下拉仓库值
export const getWarehouseValue=params=>instance.get('warehouseCtrl/queryWarehouse',{params})
//移库单-获取表格列表
export const getMoveOrderList=params=>instance.get('warehouseMovementOrderCtrl/query',{params})
//移库单-获取树
export const getMoveOrderTree=params=>instance.get('warehouseStockCtrl/getStockMaterialTree',{params})
//移库单-确认移库
export const okMoveOrder=params=>instance.get('warehouseMovementOrderCtrl/add',{params})
//打印送货单
export const printOrder=params=>instance.get('print/printCtrl/printSendGoodsOrder',{params})
//打印出库单
export const printOutOrder=params=>instance.get('print/printCtrl/printOutgoingGoodsOrder',{params})


/* 报表管理-门店报表 */
//订货统计
export const getOrderStatistics=params=>instance.get('report/storeReportCtrl/storeOrderReport',{params})
//订货统计报表
export const getOrderStatisticsExp=params=>instance.get('report/storeReportCtrl/storeOrderReportExp',{params})
//退货统计
export const getReturnStatistics=params=>instance.get('report/storeReportCtrl/storeReturnOrderReport',{params})
//退货统计报表
export const getReturnStatisticsExp=params=>instance.get('report/storeReportCtrl/storeReturnOrderReportExp',{params})
//废弃统计
export const getScrapStatistics=params=>instance.get('report/storeReportCtrl/storeScrapOrderReport',{params})
//废弃统计报表
export const getScrapStatisticsExp=params=>instance.get('report/storeReportCtrl/storeScrapOrderReportExp',{params})


/* 报表管理-物流报表 */
//门店订货
export const getStoreOrder=params=>instance.get('report/logisticsReportCtrl/storeOrderReport',{params})
//原料发货
export const getMaterialOrder=params=>instance.get('report/logisticsReportCtrl/storeOrderMaterialReport',{params})
//门店退货
export const getStoreReturn=params=>instance.get('report/logisticsReportCtrl/storeReturnOrderReport',{params})
//原料退货
export const getMaterialReturn=params=>instance.get('report/logisticsReportCtrl/storeReturnOrderMaterialReport',{params})
//门店废弃
export const getStoreScrap=params=>instance.get('report/logisticsReportCtrl/storeScrapOrderReport',{params})
//原料废弃
export const getMaterialScrap=params=>instance.get('report/logisticsReportCtrl/storeScrapOrderMaterialReport',{params})
//门店订货报表
export const getStoreOrderExp=params=>instance.get('report/logisticsReportCtrl/storeOrderReportExp',{params})
//原料发货报表
export const getMaterialOrderExp=params=>instance.get('report/logisticsReportCtrl/storeOrderMaterialReportExp',{params})
//门店退货报表
export const getStoreReturnExp=params=>instance.get('report/logisticsReportCtrl/storeReturnOrderReportExp',{params})
//原料退货报表
export const getMaterialReturnExp=params=>instance.get('report/logisticsReportCtrl/storeReturnOrderMaterialReportExp',{params})
//门店废弃报表
export const getStoreScrapExp=params=>instance.get('report/logisticsReportCtrl/storeScrapOrderReportExp',{params})
//原料废弃报表
export const getMaterialScrapExp=params=>instance.get('report/logisticsReportCtrl/storeScrapOrderMaterialReportExp',{params})
//仓库废弃
export const getLogWarehouseScrap=params=>instance.get('report/logisticsReportCtrl/warehouseScrapOrderReport',{params})
//仓库废弃报表
export const getLogWarehouseScrapExp=params=>instance.get('report/logisticsReportCtrl/warehouseScrapOrderReport',{params})
//仓库原料废弃
export const getLogWareMaterialhouseScrap=params=>instance.get('report/logisticsReportCtrl/warehouseScrapOrderMaterialReport',{params})
//仓库原料废弃报表
export const getLogWareMaterialhouseScrapExp=params=>instance.get('report/logisticsReportCtrl/warehouseScrapOrderMaterialReportExp',{params})
//仓库统计-仓库废弃
export const getWarehouseScrap=params=>instance.get('report/warehouseReportCtrl/warehouseScrapOrderReport',{params})
//仓库原料废弃报表
export const getWarehouseScrapExp=params=>instance.get('report/warehouseReportCtrl/warehouseScrapOrderReportExp',{params})


/* 报表管理-采购报表 */
//供应商统计
export const getSupplySum=params=>instance.get('report/purchaseReportCtrl/purchaseReport',{params})
//原料统计
export const getMaterialSum=params=>instance.get('report/purchaseReportCtrl/purchaseMaterialReport',{params})
//原料下拉条
export const getMaterialList=params=>instance.get('materialCtrl/getMaterialNameId',{params})
//供应商统计报表
export const getSupplySumExp=params=>instance.get('report/purchaseReportCtrl/purchaseReportExp',{params})
//原料统计报表
export const getMaterialSumExp=params=>instance.get('report/purchaseReportCtrl/purchaseMaterialReportExp',{params})
//原料下拉条报表
export const getMaterialListExp=params=>instance.get('materialCtrl/getMaterialNameIdExp',{params})
