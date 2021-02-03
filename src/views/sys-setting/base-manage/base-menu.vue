<template>
<div class="custom-tree-container">
  <div class="block">
    <el-tree
      :data="data"
      :props="{label: 'menuNameCn'}"
      :highlight-current=true
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
      </span>
      </span>
    </el-tree>
  </div>
     <div class="dialog">
        <el-dialog title="菜单信息" :inline="true" :visible.sync="modalVisible" width="50%" :before-close="closeAddModal">
         <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" class="demo-dynamic">
           <el-form-item label="ID" v-show="false">
             <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name">
             <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="组件名称" prop="comp">
             <el-input v-model="form.comp"></el-input>
            </el-form-item>
            <el-form-item label="组件路径" prop="url">
             <el-input v-model="form.url"></el-input>
            </el-form-item>
             <el-form-item label="父节点" prop="parentId">
             <el-input v-model="form.parentId"></el-input>
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

  let id = 1000;
  export default {
    data() {
      return {
        data: [],
        form: {},
        rules:
        {
            name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
            comp: [
            { required: true, message: '请输入组件名称', trigger: 'blur' },
          ],
          url: [
            { required: true, message: '请输入组件路径', trigger: 'blur' },
          ],
          parentId: [
            { required: true, message: '请输入父节点', trigger: 'blur' },
          ],
        },
        modalVisible: false,
      }
    },
    methods: {
      append(data) {
        this.form.parentId=data.id;
        this.modalVisible = true;
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        api.PostMenuRemove({id:data.id}).then((res)=>{
        })
          },
        closeAddModal () {
        this.modalVisible = false;
      },

      addRow (form) {
      this.$refs.form.validate((valid) => {
          if (valid) {
              this.modalVisible = false;
              var row=this.form;
              console.log(row)
              api.PostMenuAdd(row).then((res)=>{
              })
            } else {
            console.log('error submit!!');
            return false;
          }
        });
        this.setDataList();
        },
       setDataList()
       {
        this.$Progress.start();
        api.getSysMenuList().then((res) => {
        this.data = res.data.menuList;
        this.$Progress.finish();
      });

       }
       },
      created () {
      this.setDataList();
      },

     
  };
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
