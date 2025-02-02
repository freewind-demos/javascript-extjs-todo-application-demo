/**
 * TodoWindow组件
 * 展示了ExtJS的以下特性：
 * 1. 自定义组件的创建和继承
 * 2. 表单组件的使用
 * 3. 数据绑定和加载
 * 4. 组件的生命周期管理
 * 5. 事件处理
 */

Ext.define('TodoWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.todowindow',

    // Configuration
    title: '编辑任务',
    width: 500,
    height: 400,
    modal: true,
    layout: 'fit',
    _todoRecord: null,

    // Getter and Setter for todoRecord
    getTodoRecord: function () {
        return this._todoRecord;
    },

    setTodoRecord: function (record) {
        this._todoRecord = record;
        var form = this.down('form');
        if (form) {
            if (record) {
                form.loadRecord(record);
            } else {
                form.reset();
                form.down('[name=status]').setValue('进行中');
            }
        }
    },

    // 定义默认配置
    items: [{
        xtype: 'form',
        bodyPadding: 10,
        defaultType: 'textfield',
        items: [
            {
                fieldLabel: '标题',
                name: 'title',
                allowBlank: false,
                width: '100%'
            },
            {
                xtype: 'textareafield',
                fieldLabel: '描述',
                name: 'description',
                width: '100%',
                height: 100
            },
            {
                xtype: 'combobox',
                fieldLabel: '状态',
                name: 'status',
                store: ['进行中', '已完成'],
                value: '进行中',
                editable: false,
                width: '100%'
            },
            {
                xtype: 'datefield',
                fieldLabel: '截止日期',
                name: 'dueDate',
                format: 'Y-m-d',
                width: '100%'
            }
        ]
    }],

    buttons: [{
        text: '保存',
        handler: function () {
            var win = this.up('window');
            var form = win.down('form');
            if (form.isValid()) {
                var values = form.getValues();
                if (win.getTodoRecord()) {
                    win.getTodoRecord().set(values);
                } else {
                    var store = Ext.getStore('todoStore');
                    var newId = (store.getCount() || 0) + 1;
                    var newRecord = {
                        id: newId,
                        ...values
                    };
                    store.add(newRecord);
                }
                win.close();
            }
        }
    }, {
        text: '取消',
        handler: function () {
            this.up('window').close();
        }
    }],

    // 初始化方法
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        // 监听show事件，确保表单状态正确
        me.on('show', function () {
            var form = me.down('form');
            if (me.getTodoRecord()) {
                form.loadRecord(me.getTodoRecord());
            } else {
                form.reset();
            }
        });
    }
}); 