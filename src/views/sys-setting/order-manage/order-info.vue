<template>
    <div class="product-info">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      </el-form>
      <el-table :data="orderShowList" size="small" style="width: 100%;">
        <el-table-column label="ID" v-if="false"  width="80" prop="id"></el-table-column>
        <el-table-column label="用户ID" width="180" prop="user_id"></el-table-column>
        <el-table-column label="订单状态" width="180" prop="order_status" :formatter="orderStatusFormatter"></el-table-column>
        <el-table-column label="付款状态" width="180" prop="pay_status" :formatter="payStatusFormatter"></el-table-column>
        <el-table-column label="收件人"  width="120" prop="consignee"></el-table-column>
        <el-table-column label="国家"  width="120" prop="country"></el-table-column>
        <el-table-column label="省"  width="120" prop="province"></el-table-column>
        <el-table-column label="城市"  width="120" prop="city"></el-table-column>
        <el-table-column label="地址"  width="120" prop="address"></el-table-column>
        <el-table-column label="手机号"  width="120" prop="mobile"></el-table-column>
        <el-table-column label="运费"  width="120" prop="shipping_fee"></el-table-column>
        <el-table-column label="付款人"  width="120" prop="pay_name"></el-table-column>
        <el-table-column label="付款ID"  width="120" prop="pay_id"></el-table-column>
        <el-table-column label="付款时间"  width="120" prop="pay_time"></el-table-column>
        <el-table-column label="实际价格"  width="120" prop="actual_price"></el-table-column>
        <el-table-column label="订单价格"  width="120" prop="order_price"></el-table-column>
        <el-table-column label="图片" width="180" >
             <template slot-scope="scope">
　　　　<img :src="scope.row.primary_pic_url" width="100" height="40" class="head_pic"/>
　　</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="700">
          <template slot-scope="scope">
            <el-button @click.native.prevent="toAddRow()" size="small">增加</el-button>
            <el-button @click.native.prevent="toEditRow(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button @click.native.prevent="toDeleteRow(scope.row.id)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount">
        </el-pagination>
      </div>

      <div class="dialog">
        <el-dialog title="产品信息" :inline="true" :visible.sync="modalVisible" width="50%" :before-close="closeAddModal">
         <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" class="demo-dynamic">
           <el-form-item label="ID" v-show="false">
             <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
             <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="一级分类" prop="primaryCategoyId">
            <el-select v-model="form.primaryCategoyId" placeholder="请选择分类">
               <el-option v-for="val in primaryCategoyList" :key="val.index" :value="val.id" :label="val.name" />
            </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="secondaryCategoryId">
            <el-select v-model="form.secondaryCategoryId" placeholder="请选择分类">
              <el-option v-for="val in secondaryCategoryList" :key="val.index" :value="val.id" :label="val.name" />  
            </el-select>
            </el-form-item>
             <el-form-item label="品牌" prop="brandId">
            <el-select v-model="form.brandId" placeholder="请选择品牌">
             <el-option v-for="val in brandList" :key="val.index" :value="val.id" :label="val.name" />  
            </el-select>
            </el-form-item>
            <el-form-item label="价格:" prop="retail_price">
             <el-input v-model.number="form.retail_price"></el-input>
            </el-form-item>
            <el-form-item prop="primary_pic_url"  label="图片路径：">
             <el-input v-model="form.primary_pic_url"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeAddModal">取 消</el-button>
            <el-button type="primary" @click="addRow(form)">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import api from 'api/index';
import enumJS from 'common/js/enum';
export default {
  data () {
    return {
      formInline: {
        schoolName: '',
        province: '',
        manager: ''
      },
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      modalVisible: false,
      form: {},
      itemCount:0,
      mytoken: {'x-nideshop-token': localStorage.getItem('token')},
      primaryCategoyList:[],
      secondaryCategoryList:[],
      originalSecondaryCategoryList:[],
      brandList:[],
      rules: {
          retail_price: [
            { required: true, message: '请输入零售价格', trigger: 'blur' },
             { type: 'number', message: '零售价格为数字值'}
          ],
           name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
           primary_pic_url: [
            { required: true, message: '请上传图片', trigger: 'blur' },
          ],
          primaryCategoyId: [
            { required: true, message: '请选择一级分类', trigger: 'blur' },
          ],
          secondaryCategoryId: [
            { required: true, message: '请选择二级分类', trigger: 'blur' },
          ],
          brandId: [
            { required: true, message: '请选择品牌', trigger: 'blur' },
          ], 
        }
      };
  },
  created () {
    this.$Progress.start();
    this.postList(1);
    this.$Progress.finish();
  },
  methods: {
    orderStatusFormatter(data)
    {
      let type = data.order_status;
      switch (type) {
        case 0:
          type = "新建";
          break;
        case 1:
          type = "已支付";
          break;
        case 2:
          type = "已送货";
          break;
        case 3:
          type = "已完成";
          break;
        case 4:
          type = "已取消";
        case 5:
            type = "已退款";  
          break;
      }
      return type;
    },

    payStatusFormatter(data)
    {
     let type =data.pay_status;
     switch(type)
     {
       case 0:
            type ='未支付';
            break;
       case 1:
            type='已支付';
            break;
     }
       return type;
    },
    postList(currentPage)
    {
      api.PostOrderList({page:currentPage}).then((res) => {
      console.log(res);
      this.orderList = res.data.data;
      this.itemCount=res.data.count
    });
    },
    handleSizeChange (val) {
      this.pageSize = val;
    },
    handleCurrentChange (val) {
    this.postList(val);
    },
    toAddRow () {
      this.form = {
        'id': '',
        'name': '',
        'retail_price': '',
        'primary_pic_url': '',
        'upload_time': '',
        'primaryCategoryId':'',
        'secondaryCategoryId':'',
        'brandId':'',
      };
      this.modalVisible = true;
    },
    addRow (form) {
      this.$refs.form.validate((valid) => {
          if (valid) {
              this.modalVisible = false;
              var row=this.form;
              row.primary_pic_url=api.setIp()+row.primary_pic_url;
              if(!row.id)
              {
              this.orderList.push(this.form);
              }
              api.goodsSave(row).then((res) => {
                  this.$Progress.finish();
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      
    },
    toEditRow (row) {
      this.form = row;
      this.form.brandId=row.brand_id,
      this.form.secondaryCategoryId=row.category_id,
      this.form.primaryCategoyId=row.parent_id,
      this.modalVisible = true;
    
    },
    toDeleteRow (rowId) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteRow(rowId);
        api.deleteProduct({id:rowId});
      });
    },
    closeAddModal () {
      this.modalVisible = false;
    },
    _deleteRow (rowId) {
      for (let i = 0; i < this.orderList.length; i++) {
        let item = this.orderList[i];

        if (item.id === rowId) {
          this.orderList.splice(i, 1);
        }
      }
    }
  },
  computed: {
    pageCount () {
      return this.itemCount;
    },
    orderShowList () {
      let ths = this;
      let returnList = ths.orderList.filter(function (item) {
        return (ths.formInline.schoolName === '' || item.name.indexOf(ths.formInline.schoolName) !== -1) &&
          (ths.formInline.province === '' || item.province.indexOf(ths.formInline.province) !== -1) &&
          (ths.formInline.manager === '' || item.manager.indexOf(ths.formInline.manager) !== -1);
      });

      return returnList && returnList.slice((ths.currentPage - 1) * ths.pageSize, ths.currentPage * ths.pageSize);
    }
  }
};
</script>

<style lang="stylus" scoped>
  .scholl-info {
    padding: 0 20px;
    font-size: 20px;
    color: rgb(192, 204, 218);

    .pagination {
      padding: 10px 0;
    }
  }
</style>
