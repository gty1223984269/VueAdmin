<template>
    <div class="product-info">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      </el-form>
      <el-table :data="schoolShowList" size="small" style="width: 100%;">
        <el-table-column label="ID" v-if="false"  width="80" prop="id"></el-table-column>
        <el-table-column label="名称" width="180" prop="name"></el-table-column>
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
         <el-form ref="form" :model="form" label-width="100px" size="mini" class="demo-dynamic">
           <el-form-item label="ID" v-show="false">
             <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称">
             <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="价格:">
             <el-input v-model="form.retail_price"></el-input>
            </el-form-item>
            <el-form-item  label="图片路径：">
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
            <el-button type="primary" @click="addRow">确 定</el-button>
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
      mytoken: {'x-nideshop-token': localStorage.getItem('token')}
    };
  },
  created () {
    this.$Progress.start();
    this.postList(1);
    this.$Progress.finish();

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
        'upload_time': ''
      };
      this.modalVisible = true;
    },
    addRow () {
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
      
    },
    toEditRow (row) {
      this.form = row;
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
