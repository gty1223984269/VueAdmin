import api from 'api/index';
export default {
  data () {
    return {
      userName: '', 
      password: '',
      errMessage: '',
      rememberFlag: 'zh', 
      langFlag: false,
      currentLang: '',
      random: Math.floor(Math.random(0, 1) * 3)
    };
  },
  created () {
    let lang = 'zh'; // localStorage.getItem('langulage') || 'zh';

    this.$i18n.locale = lang;
    this.$store.state.lang = lang;
    this.currentLang = lang;
  },
  methods: {
    loginFn () { // 登录事件
      this._confirmLogin();
    },
    rememberFn () { // 是否记住用户
      this.rememberFlag = !this.rememberFlag;
      localStorage.setItem('rememberFlag', this.rememberFlag);
    },
    showLangFn () { // 展开语言选择
      this.langFlag = !this.langFlag;
    },
    hideLangFn () {
      this.langFlag = false;
    },
    changeLangFn (lang) { // 切换语言
      this.currentLang = lang;
      this.$i18n.locale = lang;
      this.$store.state.lang = lang;
    },
    keydownFn (event) {
      if (event.keyCode === 13) {
        this._confirmLogin();
      }
    },
    _confirmLogin () {
      if (this.rememberFlag) { // 是否记住用户名
        // localStorage.setItem('loginName', this.userName);
      } else {
        // localStorage.removeItem('loginName');
      }

      if (!this.userName || !this.password) 
      {
        this.errMessage = this.$t('login.emptyMsg');
        return;
      }
        
        api.login({username:this.userName,password:this.password}).then((res)=>{
          console.log(res);
          if(res.errno==0)
          {
            localStorage.setItem('token', res.data.token);
            this.$store.commit("setUserInfo", res.data.userInfo.username);
            // 判断用户名密码是否为空
            this.errMessage = '';
            this.$store.state.isLogin = true;
            this.$router.push({path: '/sysSetting'});
          }
          else
          {
            this.errMessage =res.errmsg;
          }
        });
    }
  },
  computed: {
  }
};