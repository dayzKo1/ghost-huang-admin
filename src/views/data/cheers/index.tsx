import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Cheer } from './types'
import { getCheers, saveCheers } from './api'

const { Title } = Typography
const { TextArea } = Input

const CheersPage = () => {
  const [loading, setLoading] = useState(false)
  const [cheers, setCheers] = useState<Cheer[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCheer, setEditingCheer] = useState<Cheer | null>(null)
  const [form] = Form.useForm()

  const loadCheers = async () => {
    setLoading(true)
    try {
      const response = await getCheers()
      setCheers(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load cheers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCheers()
  }, [])

  const handleEdit = (record: Cheer) => {
    setEditingCheer(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingCheer(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Cheer) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedCheers = cheers.filter(c => c.title !== record.title)
          await saveCheers(updatedCheers)
          setCheers(updatedCheers)
          message.success('Cheer deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete cheer')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingCheer) {
        const updatedCheers = cheers.map(c => c.title === editingCheer.title ? { ...c, ...values } : c)
        await saveCheers(updatedCheers)
        setCheers(updatedCheers)
        message.success('Cheer updated successfully')
      } else {
        const newCheer: Cheer = {
          ...values,
          content: values.content || [],
        }
        const updatedCheers = [...cheers, newCheer]
        await saveCheers(updatedCheers)
        setCheers(updatedCheers)
        message.success('Cheer created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save cheer')
    }
  }

  const columns: ColumnsType<Cheer> = [
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
          <Title level={3}>Cheers Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Cheer
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={cheers}
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
        title={editingCheer ? 'Edit Cheer' : 'Add Cheer'}
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
          <Tabs
            defaultActiveKey="content"
            items={[
              {
                key: 'content',
                label: 'Content',
                children: (
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
                              name={[name, 'subtitle']}
                              label="Subtitle"
                            >
                              <Input placeholder="Subtitle" />
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
                            <Form.List name={[name, 'items']}>
                              {(itemFields, { add: addItem, remove: removeItem }) => (
                                <>
                                  {itemFields.map(({ key: itemKey, name: itemName, ...restItemField }) => (
                                    <div key={itemKey} style={{ marginBottom: 8, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                                      <Form.Item
                                        {...restItemField}
                                        name={[itemName, 'songName']}
                                        label="Song Name"
                                      >
                                        <Input placeholder="Song Name" />
                                      </Form.Item>
                                      <Form.Item
                                        {...restItemField}
                                        name={[itemName, 'align']}
                                        label="Align"
                                      >
                                        <Input placeholder="Align" />
                                      </Form.Item>
                                      <Form.Item
                                        {...restItemField}
                                        name={[itemName, 'link']}
                                        label="Link"
                                      >
                                        <Input placeholder="Link" />
                                      </Form.Item>
                                      <Form.Item
                                        {...restItemField}
                                        name={[itemName, 'videoPath']}
                                        label="Video Path"
                                      >
                                        <Input placeholder="Video Path" />
                                      </Form.Item>
                                      <Form.Item
                                        {...restItemField}
                                        name={[itemName, 'lyric']}
                                        label="Lyric"
                                      >
                                        <TextArea rows={2} placeholder="Lyric" />
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
                ),
              },
            ]}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default CheersPage
