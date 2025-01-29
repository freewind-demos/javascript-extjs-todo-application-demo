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
    extend: 'Ext.window.Window', // 继承自Window组件

    // 基本配置
    title: '编辑任务',
    width: 500,
    height: 400,
    modal: true, // 模态窗口，阻止对其他组件的操作
    layout: 'fit',

    // 配置选项，用于接收外部传入的数据
    config: {
        todoRecord: null // 当编辑现有任务时，存储任务记录
    },

    // 组件初始化方法
    // 在这里创建和配置子组件
    initComponent: function () {
        const me = this;

        // 创建表单面板
        // ExtJS提供了丰富的表单组件，支持各种类型的输入
        const form = Ext.create('Ext.form.Panel', {
            bodyPadding: 10,
            defaultType: 'textfield', // 默认字段类型
            items: [
                {
                    fieldLabel: '标题',
                    name: 'title',
                    allowBlank: false, // 必填字段
                    width: '100%'
                },
                {
                    xtype: 'textareafield', // 多行文本输入
                    fieldLabel: '描述',
                    name: 'description',
                    width: '100%',
                    height: 100
                },
                {
                    xtype: 'combobox', // 下拉选择框
                    fieldLabel: '状态',
                    name: 'status',
                    store: ['待开始', '进行中', '已完成'], // 简单的数组数据源
                    editable: false,
                    width: '100%'
                },
                {
                    xtype: 'datefield', // 日期选择器
                    fieldLabel: '截止日期',
                    name: 'dueDate',
                    format: 'Y-m-d',
                    width: '100%'
                }
            ]
        });

        // 如果是编辑模式，加载现有数据到表单
        if (me.todoRecord) {
            form.loadRecord(me.todoRecord);
        }

        // 配置底部按钮
        // 展示了如何处理用户交互和数据保存
        const buttons = [
            {
                text: '保存',
                handler: function () {
                    const form = this.up('window').down('form');
                    if (form.isValid()) { // 表单验证
                        const values = form.getValues();
                        if (me.todoRecord) {
                            // 更新现有记录
                            // ExtJS的数据绑定系统会自动更新UI
                            me.todoRecord.set(values);
                        } else {
                            // 创建新记录
                            // 通过Store管理数据的添加
                            const store = Ext.getStore('todoStore');
                            const newId = store.getCount() + 1;
                            store.add({
                                id: newId,
                                ...values
                            });
                        }
                        me.close(); // 关闭窗口
                    }
                }
            },
            {
                text: '取消',
                handler: function () {
                    this.up('window').close();
                }
            }
        ];

        // 使用Ext.apply合并配置
        // 这是ExtJS推荐的配置合并方式
        Ext.apply(me, {
            items: form,
            buttons: buttons
        });

        // 调用父类的初始化方法
        // 确保继承的功能正常工作
        me.callParent();
    }
}); 