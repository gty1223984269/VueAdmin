<template>
<div class="custom-tree-container">
  <div class="block">
    <el-tree
      :data="data"
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
</div>
</template>
<script type="text/ecmascript-6">
import api from 'api/index';

  let id = 1000;
  export default {
    data() {
      return {
        data: [],
      }
    },

    methods: {
      append(data) {
        this.$prompt('请输入分类名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
        const newChild = { id: id++, label: value, children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        // api.PostCategogyAdd({parent_id:data.id,name:value}).then((res)=>{
        // })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });       
        });
       
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        api.PostCategoryDelete({}).then((res)=>{

        })
      },
        
    },
    created () {
    this.$Progress.start();
    api.getCategoryList().then((res) => {
      this.data = res.data.categoryList;
      this.$Progress.finish();
    });
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
