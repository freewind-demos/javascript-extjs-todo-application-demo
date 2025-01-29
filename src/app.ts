import './TodoWindow';

/**
 * 这个demo展示了ExtJS的核心特性：
 * 1. 组件化开发
 * 2. 数据驱动
 * 3. 布局系统
 * 4. 事件处理
 * 5. 数据绑定
 */

// 定义Todo数据模型
// ExtJS的数据模型系统支持字段定义、验证、关联等特性
Ext.define('Todo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'int' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'dueDate', type: 'date' }
    ]
});

// 创建并注册全局Store
// Store是ExtJS的数据管理中心，负责数据的加载、排序、过滤、分组等操作
Ext.create('Ext.data.Store', {
    storeId: 'todoStore', // 注册为全局Store，可以通过Ext.getStore获取
    model: 'Todo',
    data: [
        { id: 1, title: '完成ExtJS Demo', description: '创建一个展示ExtJS特性的Demo', status: '进行中', dueDate: new Date() },
        { id: 2, title: '学习TypeScript', description: '深入学习TypeScript的高级特性', status: '待开始', dueDate: new Date(2024, 1, 15) },
        { id: 3, title: '准备会议', description: '准备下周的技术分享会议', status: '已完成', dueDate: new Date(2024, 1, 10) }
    ]
});

// 创建主应用界面
// ExtJS的组件系统支持声明式配置，使用xtype指定组件类型
Ext.onReady(() => {
    console.log('Application initializing...');
    console.log('Checking if TodoWindow is defined:', Ext.ClassManager.get('TodoWindow'));

    new Ext.container.Viewport({
        layout: 'border', // 使用border布局进行整体布局
        items: [
            // 顶部标题栏
            {
                region: 'north',
                xtype: 'panel',
                height: 50,
                bodyStyle: 'background-color: #1a73e8; color: white; font-size: 20px; padding: 10px;',
                html: '待办事项管理'
            },
            // 左侧导航栏
            // 使用TreePanel实现分类导航
            {
                region: 'west',
                xtype: 'panel',
                width: 200,
                split: true, // 可调整宽度
                collapsible: true, // 可折叠
                title: '导航',
                layout: 'fit',
                items: [{
                    xtype: 'treepanel',
                    root: {
                        expanded: true,
                        children: [
                            { text: '所有任务', leaf: true, id: 'all' },
                            { text: '进行中', leaf: true, id: 'inProgress' },
                            { text: '已完成', leaf: true, id: 'completed' }
                        ]
                    },
                    // 事件处理：点击树节点时过滤数据
                    listeners: {
                        itemclick: function (view, record) {
                            const store = Ext.getStore('todoStore');
                            store.clearFilter();

                            if (record.get('id') !== 'all') {
                                store.filterBy(function (rec) {
                                    const status = rec.get('status');
                                    if (record.get('id') === 'inProgress') {
                                        return status === '进行中';
                                    } else if (record.get('id') === 'completed') {
                                        return status === '已完成';
                                    }
                                    return true;
                                });
                            }
                        }
                    }
                }]
            },
            // 主内容区域
            // 使用Grid展示数据，实现数据的展示和选择
            {
                region: 'center',
                xtype: 'panel',
                layout: 'fit',
                items: [{
                    xtype: 'grid',
                    store: Ext.getStore('todoStore'), // 绑定数据源
                    selModel: {
                        type: 'rowmodel',
                        mode: 'SINGLE'
                    },
                    columns: [
                        { text: 'ID', dataIndex: 'id', width: 50 },
                        { text: '标题', dataIndex: 'title', flex: 1 },
                        { text: '描述', dataIndex: 'description', flex: 2 },
                        { text: '状态', dataIndex: 'status', width: 100 },
                        {
                            text: '截止日期',
                            dataIndex: 'dueDate',
                            width: 120,
                            renderer: Ext.util.Format.dateRenderer('Y-m-d') // 使用内置的日期格式化器
                        }
                    ],
                    // 工具栏：实现数据的增删改操作
                    tbar: [
                        {
                            text: '新建任务',
                            iconCls: 'x-fa fa-plus',
                            handler: function () {
                                console.log('New task button clicked');
                                try {
                                    console.log('Creating TodoWindow...');
                                    const win = new Ext.window.Window({
                                        xtype: 'todowindow',
                                        title: '新建任务'
                                    });
                                    console.log('TodoWindow created:', win);
                                    win.show();
                                    console.log('TodoWindow shown');
                                } catch (error) {
                                    console.error('Error creating TodoWindow:', error);
                                }
                            }
                        },
                        {
                            text: '编辑任务',
                            iconCls: 'x-fa fa-edit',
                            handler: function () {
                                const grid = this.up('grid');
                                const selected = grid.getSelection()[0];
                                if (selected) {
                                    // 创建编辑窗口并加载选中的记录
                                    Ext.create('TodoWindow', {
                                        title: '编辑任务',
                                        todoRecord: selected
                                    }).show();
                                } else {
                                    Ext.Msg.alert('提示', '请先选择一个任务');
                                }
                            }
                        },
                        {
                            text: '删除任务',
                            iconCls: 'x-fa fa-trash',
                            handler: function () {
                                const grid = this.up('grid');
                                const selected = grid.getSelection()[0];
                                if (selected) {
                                    // 使用内置的消息框组件进行确认
                                    Ext.Msg.confirm('确认', '确定要删除这个任务吗？', function (btn) {
                                        if (btn === 'yes') {
                                            const store = Ext.getStore('todoStore');
                                            store.remove(selected);
                                        }
                                    });
                                } else {
                                    Ext.Msg.alert('提示', '请先选择一个任务');
                                }
                            }
                        }
                    ]
                }]
            }
        ]
    });

    console.log('Application initialized');
});