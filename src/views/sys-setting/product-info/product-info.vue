<template>
    <div class="product-info">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      </el-form>
      <el-table :data="schoolShowList" size="small" style="width: 100%;">
        <el-table-column label="ID" v-if="false"  width="80" prop="id"></el-table-column>
        <el-table-column label="名称" width="180" prop="name"></el-table-column>
        <el-table-column v-if="false" width="180" prop="category_id"></el-table-column>
        <el-table-column v-if="false" width="180" prop="parent_id"></el-table-column>
        <el-table-column v-if="false"  width="180" prop="brand_id"></el-table-column>
         <el-table-column label="分类" width="180" prop="categoryName"></el-table-column>
        <el-table-column label="品牌" width="180" prop="brandName"></el-table-column>
        <el-table-column label="价格"  width="120" prop="retail_price"></el-table-column>
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
            <el-select v-model="form.primaryCategoyId" placeholder="请选择分类" @change="categoryChange">
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
            <el-form-item label="上传图片: ">
               <el-upload
                class="upload-demo"
                :on-success="afterUpload"
                :limit="1"
                drag
                action="http://127.0.0.1:8360/admin/backEnd/uploadFile"
                :headers="mytoken"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
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

export default {
  data () {
    return {
      formInline: {
        schoolName: '',
        province: '',
        manager: ''
      },
      productList: [],
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
    this.SetCategoryList();
    this.SetBrandList();

  },
  methods: {
    postList(currentPage)
    {
      api.getProductList({page:currentPage}).then((res) => {
      this.productList = res.data.data;
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
              this.productList.push(this.form);
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
      for (let i = 0; i < this.productList.length; i++) {
        let item = this.productList[i];

        if (item.id === rowId) {
          this.productList.splice(i, 1);
        }
      }
    },
   afterUpload(response, file, fileList)
    {
      this.form.primary_pic_url=response.data.filePath;
    },
    SetCategoryList()
    {
     api.PostCategoryList().then((res)=>{
       var data =res.data;
       var primaryCategoyList=data.filter(x=>x.level=='L1');
       var secondaryCategoryList =data.filter(x=>x.level=='L2');
       this.primaryCategoyList=primaryCategoyList;
       this.secondaryCategoryList=secondaryCategoryList;
       this.originalSecondaryCategoryList=secondaryCategoryList;
       console.log(res);
     })
    },
    SetBrandList()
    {
      api.PostBrandList().then((res)=>{
      var data =res.data;
      this.brandList=data;
      })
    },

    categoryChange(val)
    {
      this.secondaryCategoryList=this.originalSecondaryCategoryList.filter(x=>x.parent_id==val);
    }
  },
  computed: {
    pageCount () {
      return this.itemCount;
    },
    schoolShowList () {
      let ths = this;
      let returnList = ths.productList.filter(function (item) {
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
