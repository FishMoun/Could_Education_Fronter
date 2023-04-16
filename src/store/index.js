import { createStore } from 'vuex'
export default createStore({
  state: {
    // #region 导航功能
    isCollapse: false,
    tabList: [],
    // #endregion

    // #region 云盘功能
    isSelectAll: false,
    // 是否正在新建文件夹
    isCreateFolder: false,
    // 是否显示videoPlayer
    isVideoPlayerShow: false,
    // 当前打开的视频信息
    currentVideoInfo: {},
    // 当前打开的音频信息
    currentMusicInfo: {},
    // 是否显示MusicPlayer
    isMusicPlayerShow: false,
    // 音频播放状态
    musicPlayState: false,
    // 用户信息
    userInfo: JSON.parse(window.localStorage.getItem("userInfo")),
    // 当前所在的目录
    currentFolder: '',
    // 该用户的目录树
    folderList: {},
    // 当前选中文件
    selectFiles: [],
    // 相册图片显示比例
    imgScale: true,
    // 当前下载文件的信息
    currentDownloadFileInfo: { url: '', name: '' },
    // 选中的文件中是否所有文件都收藏了
    isAllFileCollect: false,
    // 是否正在获取文件夹
    isGetingFolder: false,
    // 是否显示userinfocard的menu
    isUserInfoCardMenuShow: false,
    // 展示类型 icon table
    showType: "table",
    // 当前排序方式
    sortType: "time",
    // 是否显示进度框
    isUploadProgressShow: false,
    // 当前上传进度数据数组
    uploadProgressList: [],
    // #endregion
    // #region 身份标识
    isAdmin: false,
    isTeacher: false,
    // #endregion 
    //token处理
    //用户标识
    userInfo: {
      avatar: '',
      id: '',
      nickName: '',
      userName: ''
    },
    token: '',
  },
  mutations: {
    // #region 导航功能
    // 侧边栏折叠
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    // 保存标签
    saveTab(state, tab) {
      if (state.tabList.findIndex(item => item.path === tab.path) == -1) {
        state.tabList.push({ name: tab.name, path: tab.path });
      }
    },
    // 移除标签
    removeTab(state, tab) {
      var index = state.tabList.findIndex(item => item.name === tab.name);
      state.tabList.splice(index, 1);
    },
    // 重置标签
    resetTab(state) {
      state.tabList = [];
    },
    // 侧边栏折叠
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    //#endregion
    // #region 云盘功能
    updateIsSelectAll(state, flag) {
      state.isSelectAll = flag;
    },
    // 更新是否正在新建文件夹
    updateIsCreateFolder(state, flag) {
      state.isCreateFolder = flag
    },
    // 更新videoPlayer的显示状态
    updateIsVideoPlayerShow(state, flag) {
      state.isVideoPlayerShow = flag;
    },
    // 更新当前视频信息
    updateCurrentVideoInfo(state, currentVideoInfo) {
      state.currentVideoInfo = currentVideoInfo;
    },
    // 更新当前音频信息
    updateCurrentMusicInfo(state, currentMusicInfo) {
      state.currentMusicInfo = currentMusicInfo;
    },
    // 更新MusicPlayer的显示状态
    updateIsMusicPlayerShow(state, flag) {
      state.isMusicPlayerShow = flag;
    },
    // 更新音频播放状态
    updateMusicPlayState(state, flag) {
      state.musicPlayState = flag;
    },
    // 更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 更新当前所在的目录
    updateCurrentFolder(state, currentFolder) {
      state.currentFolder = currentFolder;
    },
    // 更新当前目录结构
    updateFolderList(state, folderList) {
      state.folderList = folderList;
    },
    updateSelectFiles(state, selectFiles) {
      state.selectFiles = selectFiles
    },
    // 更新相册图像显示比例
    updateImgScale(state, flag) {
      state.imgScale = flag;
    },
    // 更新是否下载当前文件
    updateCurrentDownloadFileInfo(state, currentDownloadFileInfo) {
      state.currentDownloadFileInfo = currentDownloadFileInfo;
    },
    // 更新是否所有文件都收藏了的状态
    updateIsAllFileCollect(state, flag) {
      state.isAllFileCollect = flag;
    },
    // 更新是否正在获取文件夹
    updateIsGetingFolder(state, flag) {
      state.isGetingFolder = flag;
    },
    // 更新是否显示用户卡片菜单
    updateIsUserInfoCardMenuShow(state, flag) {
      state.isUserInfoCardMenuShow = flag
    },
    // 更新展示类型
    updateShowType(state, type) {
      state.showType = type
    },
    // 更新排序类型
    updateSortType(state, type) {
      state.sortType = type
    },
    // 更新上传进度数据
    updateUploadProgressList(state, arr) {
      state.uploadProgressList = arr;
    },
    // #endregion
  },
  actions: {
    //#region 导航功能
    saveTab(context, data) {
      context.commit('saveTab', data);
    }
    //#endregion
  },
  modules: {
  }
})

