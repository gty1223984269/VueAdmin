<template>
    <div class="product-info">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
      </el-form>
      <el-table :data="schoolShowList" size="small" style="width: 100%;">
        <el-table-column label="ID" v-if="true"  width="80" prop="id"></el-table-column>
        <el-table-column label="名称" width="180" prop="title"></el-table-column>
        <el-table-column label="价格"  width="120" prop="money"></el-table-column>
        <el-table-column label="图片路径"  width="200" prop="img_path"></el-table-column>
        <el-table-column label="时间"  width="100" prop="upload_time"></el-table-column>
        <el-table-column fixed="right" label="操作" width="520">
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
             <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="价格:">
             <el-input v-model="form.money"></el-input>
            </el-form-item>
            <el-form-item label="图片路径：">
             <el-input v-model="form.img_path"></el-input>
            </el-form-item>
            <el-form-item label="上传图片: ">
               <el-upload
                class="upload-demo"
                drag
                action="http://127.0.0.1:8360/backEnd/uploadFile"
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
      form: {}
    };
  },
  created () {
    this.$Progress.start();
    api.getProductList().then((res) => {
      this.productList = res.data.productList;
      this.$Progress.finish();
    });
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val;
    },
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    toAddRow () {
      this.form = {
        'id': '',
        'title': '',
        'money': '',
        'img_path': '',
        'upload_time': ''
      };
      // this.form.id = this.productList.length;
      this.modalVisible = true;
    },
    addRow () {
      this.modalVisible = false;
      var row=this.form;
      if(!row.id)
      {
      this.productList.push(this.form);
      }
      api.saveProduct(row).then((res) => {
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
    }
  },
  computed: {
    pageCount () {
      return this.productList.length;
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
