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
    // 创建添加/编辑Todo的Window
    var todoWindow = Ext.create('Ext.window.Window', {
        title: '添加Todo',
        width: 400,
        modal: true,
        layout: 'fit',
        closeAction: 'hide',
        items: [{
            xtype: 'form',
            bodyPadding: 10,
            items: [{
                xtype: 'textfield',
                name: 'title',
                fieldLabel: '标题',
                allowBlank: false
            }, {
                xtype: 'textareafield',
                name: 'description',
                fieldLabel: '描述',
                height: 100
            }, {
                xtype: 'combobox',
                name: 'status',
                fieldLabel: '状态',
                store: ['待开始', '进行中', '已完成'],
                value: '待开始',
                editable: false
            }, {
                xtype: 'datefield',
                name: 'dueDate',
                fieldLabel: '截止日期',
                format: 'Y-m-d',
                value: new Date()
            }],
            buttons: [{
                text: '保存',
                handler: function () {
                    var form = this.up('form');
                    if (form.isValid()) {
                        var values = form.getValues();
                        var store = Ext.getStore('todoStore');

                        if (form.editingRecord) {
                            // 编辑模式
                            form.editingRecord.set(values);
                        } else {
                            // 添加模式
                            values.id = store.getCount() + 1;
                            store.add(values);
                        }

                        todoWindow.hide();
                        form.reset();
                        form.editingRecord = null;
                    }
                }
            }, {
                text: '取消',
                handler: function () {
                    var form = this.up('form');
                    form.reset();
                    form.editingRecord = null;
                    todoWindow.hide();
                }
            }]
        }]
    });

    // 创建主界面
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [{
            region: 'north',
            xtype: 'toolbar',
            items: [{
                text: '添加Todo',
                iconCls: 'x-tool-plus',
                handler: function () {
                    todoWindow.show();
                }
            }, '-', {
                xtype: 'combobox',
                fieldLabel: '状态筛选',
                store: ['全部', '待开始', '进行中', '已完成'],
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
                        case '待开始':
                            color = 'gray';
                            break;
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
                width: 100,
                text: '操作',
                items: [{
                    iconCls: 'x-tool-gear',
                    tooltip: '编辑',
                    handler: function (grid, rowIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        var form = todoWindow.down('form');
                        form.loadRecord(record);
                        form.editingRecord = record;
                        todoWindow.show();
                    }
                }, {
                    iconCls: 'x-tool-close',
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