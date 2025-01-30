// 定义Todo数据模型
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
Ext.create('Ext.data.Store', {
    storeId: 'todoStore',
    model: 'Todo',
    data: [
        { id: 1, title: '完成ExtJS Demo', description: '创建一个展示ExtJS特性的Demo', status: '进行中', dueDate: new Date() },
        { id: 2, title: '学习TypeScript', description: '深入学习TypeScript的高级特性', status: '待开始', dueDate: new Date(2024, 1, 15) },
        { id: 3, title: '准备会议', description: '准备下周的技术分享会议', status: '已完成', dueDate: new Date(2024, 1, 10) }
    ]
});

// 创建主应用界面
Ext.onReady(function () {
    new Ext.container.Viewport({
        layout: 'border',
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
            {
                region: 'west',
                xtype: 'panel',
                width: 200,
                split: true,
                collapsible: true,
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
                    listeners: {
                        itemclick: function (view, record) {
                            var store = Ext.getStore('todoStore');
                            store.clearFilter();

                            if (record.get('id') !== 'all') {
                                store.filterBy(function (rec) {
                                    var status = rec.get('status');
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
            {
                region: 'center',
                xtype: 'panel',
                layout: 'fit',
                items: [{
                    xtype: 'grid',
                    store: Ext.getStore('todoStore'),
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
                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        }
                    ],
                    tbar: [
                        {
                            text: '新建任务',
                            iconCls: 'x-fa fa-plus',
                            handler: function () {
                                Ext.create('TodoWindow', {
                                    title: '新建任务'
                                }).show();
                            }
                        },
                        {
                            text: '编辑任务',
                            iconCls: 'x-fa fa-edit',
                            handler: function () {
                                var grid = this.up('grid');
                                var selected = grid.getSelection()[0];
                                if (selected) {
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
                                var grid = this.up('grid');
                                var selected = grid.getSelection()[0];
                                if (selected) {
                                    Ext.Msg.confirm('确认', '确定要删除这个任务吗？', function (btn) {
                                        if (btn === 'yes') {
                                            var store = Ext.getStore('todoStore');
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
}); 