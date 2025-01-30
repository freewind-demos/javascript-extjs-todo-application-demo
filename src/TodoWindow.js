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
    todoRecord: null,

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
                store: ['待开始', '进行中', '已完成'],
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
                if (win.todoRecord) {
                    win.todoRecord.set(values);
                } else {
                    var store = Ext.getStore('todoStore');
                    var newId = (store.getCount() || 0) + 1;
                    store.add({
                        id: newId,
                        ...values
                    });
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

        // 如果是编辑模式，加载数据
        if (me.todoRecord) {
            me.down('form').loadRecord(me.todoRecord);
        }
    }
}); 