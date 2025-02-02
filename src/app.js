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
var todoStore = Ext.create('Ext.data.Store', {
    storeId: 'todoStore',
    model: 'Todo',
    data: [
        { id: 1, title: '完成ExtJS Demo', description: '创建一个展示ExtJS特性的Demo', status: '进行中', dueDate: new Date() },
        { id: 2, title: '学习TypeScript', description: '深入学习TypeScript的高级特性', status: '进行中', dueDate: new Date(2024, 1, 15) },
        { id: 3, title: '准备会议', description: '准备下周的技术分享会议', status: '已完成', dueDate: new Date(2024, 1, 10) }
    ]
});

// 创建主应用界面
Ext.onReady(function () {
    // 创建添加/编辑Todo的Window
    var todoWindow = Ext.create('TodoWindow', {
        closeAction: 'hide'
    });

    // 创建主界面
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'north',
            xtype: 'toolbar',
            items: [{
                text: '添加Todo',
                iconCls: 'fa fa-plus',
                handler: function () {
                    todoWindow.setTodoRecord(null);
                    todoWindow.show();
                }
            }, '-', {
                xtype: 'combobox',
                fieldLabel: '状态筛选',
                store: ['全部', '进行中', '已完成'],
                value: '全部',
                labelWidth: 60,
                width: 160,
                editable: false,
                listeners: {
                    select: function (combo, record) {
                        var store = Ext.getStore('todoStore');
                        if (record.get('field1') === '全部') {
                            store.clearFilter();
                        } else {
                            store.filterBy(function (record) {
                                return record.get('status') === combo.getValue();
                            });
                        }
                    }
                }
            }]
        }, {
            region: 'center',
            xtype: 'grid',
            store: 'todoStore',
            columns: [{
                xtype: 'actioncolumn',
                width: 50,
                align: 'center',
                text: '完成',
                items: [{
                    getClass: function (value, meta, record) {
                        if (record.get('status') === '已完成') {
                            meta.tdCls = 'task-completed';
                            return 'fa fa-check-circle';
                        } else {
                            meta.tdCls = 'task-pending';
                            return 'fa fa-circle-o';
                        }
                    },
                    getTip: function (value, meta, record) {
                        return record.get('status') === '已完成' ? '点击取消完成' : '点击标记完成';
                    },
                    handler: function (grid, rowIndex) {
                        var view = this.up('grid');
                        var record = view.getStore().getAt(rowIndex);
                        var oldStatus = record.get('status');
                        var newStatus = oldStatus === '已完成' ? '进行中' : '已完成';
                        record.set('status', newStatus);
                        // 刷新整行
                        view.getView().refreshNode(record);
                    }
                }]
            }, {
                text: '标题',
                dataIndex: 'title',
                flex: 1
            }, {
                text: '描述',
                dataIndex: 'description',
                flex: 2
            }, {
                text: '状态',
                dataIndex: 'status',
                width: 100,
                renderer: function (value) {
                    var color;
                    switch (value) {
                        case '进行中':
                            color = 'blue';
                            break;
                        case '已完成':
                            color = 'green';
                            break;
                    }
                    return '<span style="color:' + color + '">' + value + '</span>';
                }
            }, {
                text: '截止日期',
                dataIndex: 'dueDate',
                width: 120,
                renderer: Ext.util.Format.dateRenderer('Y-m-d')
            }, {
                xtype: 'actioncolumn',
                width: 80,
                text: '操作',
                items: [{
                    iconCls: 'fa fa-edit',
                    tooltip: '编辑',
                    handler: function (grid, rowIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        todoWindow.setTodoRecord(record);
                        todoWindow.show();
                    }
                }, {
                    iconCls: 'fa fa-trash',
                    tooltip: '删除',
                    handler: function (grid, rowIndex) {
                        Ext.Msg.confirm('确认', '确定要删除这条Todo吗?', function (btn) {
                            if (btn === 'yes') {
                                grid.getStore().removeAt(rowIndex);
                            }
                        });
                    }
                }]
            }]
        }]
    });
}); 