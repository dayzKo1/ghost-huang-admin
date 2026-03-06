import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Related } from './types'
import { getRelated, saveRelated } from './api'

const { Title } = Typography

const RelatedPage = () => {
  const [loading, setLoading] = useState(false)
  const [related, setRelated] = useState<Related[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRelated, setEditingRelated] = useState<Related | null>(null)
  const [form] = Form.useForm()

  const loadRelated = async () => {
    setLoading(true)
    try {
      const response = await getRelated()
      setRelated(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load related. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRelated()
  }, [])

  const handleEdit = (record: Related) => {
    setEditingRelated(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingRelated(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Related) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedRelated = related.filter(r => r.title !== record.title)
          await saveRelated(updatedRelated)
          setRelated(updatedRelated)
          message.success('Related deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete related')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingRelated) {
        const updatedRelated = related.map(r => r.title === editingRelated.title ? { ...r, ...values } : r)
        await saveRelated(updatedRelated)
        setRelated(updatedRelated)
        message.success('Related updated successfully')
      } else {
        const newRelated: Related = {
          ...values,
          content: values.content || [],
        }
        const updatedRelated = [...related, newRelated]
        await saveRelated(updatedRelated)
        setRelated(updatedRelated)
        message.success('Related created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save related')
    }
  }

  const columns: ColumnsType<Related> = [
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
          <Title level={3}>Related Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Related
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={related}
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
        title={editingRelated ? 'Edit Related' : 'Add Related'}
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
                    <Form.Item
                      {...restField}
                      name={[name, 'subtitle']}
                      label="Subtitle"
                    >
                      <Input placeholder="Subtitle" />
                    </Form.Item>
                    <Form.List name={[name, 'content']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map(({ key: itemKey, name: itemName, ...restItemField }) => (
                            <div key={itemKey} style={{ marginBottom: 8, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'avatar']}
                                label="Avatar"
                              >
                                <Input placeholder="Avatar" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'name']}
                                label="Name"
                              >
                                <Input placeholder="Name" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'avatarTitle']}
                                label="Avatar Title"
                              >
                                <Input placeholder="Avatar Title" />
                              </Form.Item>
                              <Form.Item
                                {...restItemField}
                                name={[itemName, 'link']}
                                label="Link"
                              >
                                <Input placeholder="Link" />
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

export default RelatedPage
