import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Product } from './types'
import { getProducts, saveProducts } from './api'

const { Title } = Typography

const ProductsPage = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const loadProducts = async () => {
    setLoading(true)
    try {
      const response = await getProducts()
      setProducts(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Product) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedProducts = products.filter(p => p.title !== record.title)
          await saveProducts(updatedProducts)
          setProducts(updatedProducts)
          message.success('Product deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete product')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingProduct) {
        const updatedProducts = products.map(p => p.title === editingProduct.title ? { ...p, ...values } : p)
        await saveProducts(updatedProducts)
        setProducts(updatedProducts)
        message.success('Product updated successfully')
      } else {
        const newProduct: Product = {
          ...values,
          content: values.content || [],
        }
        const updatedProducts = [...products, newProduct]
        await saveProducts(updatedProducts)
        setProducts(updatedProducts)
        message.success('Product created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save product')
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Products Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Product
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="title"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.List name="content">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      label="Type"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Type" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleAlign']}
                      label="Title Align"
                    >
                      <Input placeholder="Title Align" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleMargin']}
                      label="Title Margin"
                    >
                      <Input placeholder="Title Margin" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'backgroundImage']}
                      label="Background Image"
                    >
                      <Input placeholder="Background Image" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'index']}
                      label="Index"
                    >
                      <Input type="number" placeholder="Index" />
                    </Form.Item>
                    <Form.List name={[name, 'products']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map(({ key: itemKey, name: itemName, ...restItemField }) => (
                            <div key={itemKey} style={{ marginBottom: 8, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'title']}
                                label="Title"
                                rules={[{ required: true }]}
                              >
                                <Input placeholder="Title" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'subtitle']}
                                label="Subtitle"
                              >
                                <Input placeholder="Subtitle" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'productLink']}
                                label="Product Link"
                              >
                                <Input placeholder="Product Link" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'productImage']}
                                label="Product Image"
                              >
                                <Input placeholder="Product Image" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'buttonText']}
                                label="Button Text"
                              >
                                <Input placeholder="Button Text" />
                              </Form.Item>
                              <Button type="link" danger onClick={() => removeItem(itemName)}>
                                <MinusCircleOutlined /> Remove Item
                              </Button>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addItem()} block icon={<PlusOutlined />}>
                            Add Item
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Button type="link" danger onClick={() => remove(name)}>
                      <MinusCircleOutlined /> Remove Section
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Section
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductsPage
